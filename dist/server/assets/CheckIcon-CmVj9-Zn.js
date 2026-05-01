import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { t as QuestionType } from "./localQuizQuestion-DBCpCJHX.js";
import { a as paginatedRequest, i as canvasApi, n as rateLimitAwarePost, t as rateLimitAwareDelete } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { a as markdownToHTMLSafe } from "./BreadCrumbs-xctKec6Z.js";
import { a as canvasModuleService, n as useAddCanvasModuleMutation, r as useCanvasModulesQuery } from "./canvasModuleHooks-CfBKJ1j2.js";
import { t as canvasAssignmentService } from "./canvasAssignmentService-intGhTQJ.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/quizzes/quizHooks.ts
var useQuizQuery = (moduleName, quizName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().quiz.getQuiz.queryOptions({
		courseName,
		moduleName,
		quizName
	}));
};
var useQuizzesQueries = (moduleName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().quiz.getAllQuizzes.queryOptions({
		courseName,
		moduleName
	}));
};
var useUpdateQuizMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.quiz.updateQuiz.mutationOptions({ onSuccess: (_, { courseName, moduleName, quizName, previousModuleName }) => {
		if (moduleName !== previousModuleName) queryClient.invalidateQueries({ queryKey: trpc.quiz.getAllQuizzes.queryKey({
			courseName,
			moduleName: previousModuleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.quiz.getAllQuizzes.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.quiz.getQuiz.queryKey({
			courseName,
			moduleName,
			quizName
		}) });
	} }));
};
var useCreateQuizMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.quiz.createQuiz.mutationOptions({ onSuccess: (_, { courseName, moduleName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.quiz.getAllQuizzes.queryKey({
			courseName,
			moduleName
		}) });
	} }));
};
var useDeleteQuizMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.quiz.deleteQuiz.mutationOptions({ onSuccess: (_, { courseName, moduleName, quizName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.quiz.getAllQuizzes.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.quiz.getQuiz.queryKey({
			courseName,
			moduleName,
			quizName
		}) });
	} }));
};
//#endregion
//#region src/services/utils/questionHtmlUtils.ts
function escapeMatchingText(input) {
	return input.replaceAll("\\-", "-");
}
//#endregion
//#region src/features/canvas/services/canvasQuizService.ts
var getAnswersForCanvas = (question, settings) => {
	if (question.questionType === QuestionType.MATCHING) return question.answers.map((a) => {
		return {
			answer_match_left: question.questionType === QuestionType.MATCHING ? escapeMatchingText(a.text) : a.text,
			answer_match_right: a.matchedText
		};
	});
	if (question.questionType === QuestionType.NUMERICAL) return question.answers.map((answer) => {
		if (answer.numericalAnswerType === "range_answer") return {
			numerical_answer_type: answer.numericalAnswerType,
			answer_range_start: answer.numericAnswerRangeMin,
			answer_range_end: answer.numericAnswerRangeMax
		};
		return {
			numerical_answer_type: answer.numericalAnswerType,
			exact: answer.numericAnswer
		};
	});
	return question.answers.map((answer) => ({
		answer_html: markdownToHTMLSafe({
			markdownString: answer.text,
			settings
		}),
		answer_weight: answer.correct ? 100 : 0,
		answer_text: answer.text
	}));
};
var getQuestionTypeForCanvas = (question) => {
	return `${question.questionType.replace("=", "")}_question`;
};
var createQuestionOnly = async (canvasCourseId, canvasQuizId, question, position, settings) => {
	console.log("Creating individual question");
	const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/questions`;
	console.log(question);
	const newQuestion = (await rateLimitAwarePost(url, { question: {
		question_text: markdownToHTMLSafe({
			markdownString: question.text,
			settings
		}),
		question_type: getQuestionTypeForCanvas(question),
		points_possible: question.points,
		position,
		answers: getAnswersForCanvas(question, settings),
		correct_comments: question.incorrectComments,
		incorrect_comments: question.incorrectComments,
		neutral_comments: question.neutralComments
	} })).data;
	if (!newQuestion) throw new Error("Created question is null");
	return {
		question: newQuestion,
		position
	};
};
var hackFixQuestionOrdering = async (canvasCourseId, canvasQuizId, questionAndPositions) => {
	console.log("Fixing question order");
	const order = questionAndPositions.map((qp) => ({
		type: "question",
		id: qp.question.id.toString()
	}));
	await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/reorder`, { order });
};
var verifyQuestionOrder = async (canvasCourseId, canvasQuizId, localQuiz) => {
	console.log("Verifying question order in Canvas quiz");
	try {
		const canvasQuestions = await canvasQuizService.getQuizQuestions(canvasCourseId, canvasQuizId);
		if (canvasQuestions.length !== localQuiz.questions.length) {
			console.error(`Question count mismatch: Canvas has ${canvasQuestions.length}, local quiz has ${localQuiz.questions.length}`);
			return false;
		}
		const stripHtml = (html) => {
			return html.replace(/<[^>]*>/g, "").trim();
		};
		for (let i = 0; i < localQuiz.questions.length; i++) {
			const localQuestion = localQuiz.questions[i];
			const canvasQuestion = canvasQuestions[i];
			const localQuestionText = localQuestion.text.trim();
			const canvasQuestionText = stripHtml(canvasQuestion.question_text).trim();
			if (!canvasQuestionText.includes(localQuestionText) && !localQuestionText.includes(canvasQuestionText)) {
				console.error(`Question order mismatch at position ${i}:`, `Local: "${localQuestionText}"`, `Canvas: "${canvasQuestionText}"`);
				return false;
			}
			if (canvasQuestion.position !== void 0 && canvasQuestion.position !== i + 1) {
				console.error(`Question position mismatch at index ${i}: Canvas position is ${canvasQuestion.position}, expected ${i + 1}`);
				return false;
			}
		}
		console.log("Question order verification successful");
		return true;
	} catch (error) {
		console.error("Error during question order verification:", error);
		return false;
	}
};
var hackFixRedundantAssignments = async (canvasCourseId) => {
	console.log("hack fixing redundant quiz assignments that are auto-created");
	const assignmentsToDelete = (await canvasAssignmentService.getAll(canvasCourseId)).filter((assignment) => !assignment.is_quiz_assignment && assignment.submission_types.includes("online_quiz"));
	await Promise.all(assignmentsToDelete.map(async (assignment) => await canvasAssignmentService.delete(canvasCourseId, assignment.id, assignment.name)));
	console.log(`Deleted ${assignmentsToDelete.length} redundant assignments`);
};
var createQuizQuestions = async (canvasCourseId, canvasQuizId, localQuiz, settings) => {
	console.log("Creating quiz questions");
	const tasks = localQuiz.questions.map(async (question, index) => await createQuestionOnly(canvasCourseId, canvasQuizId, question, index, settings));
	await hackFixQuestionOrdering(canvasCourseId, canvasQuizId, await Promise.all(tasks));
	await hackFixRedundantAssignments(canvasCourseId);
	if (!await verifyQuestionOrder(canvasCourseId, canvasQuizId, localQuiz)) console.warn("Question order verification failed! The quiz was created but the question order may not match the intended order.");
};
var canvasQuizService = {
	async getAll(canvasCourseId) {
		try {
			return (await paginatedRequest({ url: `${canvasApi}/courses/${canvasCourseId}/quizzes` })).map((quiz) => ({
				...quiz,
				due_at: quiz.due_at ? new Date(quiz.due_at).toLocaleString() : void 0,
				lock_at: quiz.lock_at ? new Date(quiz.lock_at).toLocaleString() : void 0
			}));
		} catch (error) {
			if (error?.response?.status === 403) {
				console.log("Canvas API error: 403 Forbidden for quizzes. Returning empty array.");
				return [];
			}
			throw error;
		}
	},
	async getQuizQuestions(canvasCourseId, canvasQuizId) {
		try {
			return (await paginatedRequest({ url: `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/questions` })).sort((a, b) => (a.position || 0) - (b.position || 0));
		} catch (error) {
			console.error("Error fetching quiz questions from Canvas:", error);
			throw error;
		}
	},
	async create(canvasCourseId, localQuiz, settings, canvasAssignmentGroupId) {
		console.log("Creating quiz", localQuiz);
		const { data: canvasQuiz } = await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/quizzes`, { quiz: {
			title: localQuiz.name,
			description: markdownToHTMLSafe({
				markdownString: localQuiz.description,
				settings
			}),
			shuffle_answers: localQuiz.shuffleAnswers,
			access_code: localQuiz.password,
			show_correct_answers: localQuiz.showCorrectAnswers,
			allowed_attempts: localQuiz.allowedAttempts,
			one_question_at_a_time: localQuiz.oneQuestionAtATime,
			cant_go_back: false,
			due_at: localQuiz.dueAt ? getDateFromStringOrThrow(localQuiz.dueAt, "creating quiz").toISOString() : void 0,
			lock_at: localQuiz.lockAt ? getDateFromStringOrThrow(localQuiz.lockAt, "creating quiz").toISOString() : void 0,
			assignment_group_id: canvasAssignmentGroupId
		} });
		await createQuizQuestions(canvasCourseId, canvasQuiz.id, localQuiz, settings);
		return canvasQuiz.id;
	},
	async delete(canvasCourseId, canvasQuizId) {
		await rateLimitAwareDelete(`${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}`);
	}
};
//#endregion
//#region src/features/canvas/hooks/canvasQuizHooks.ts
var canvasQuizKeys = { quizzes: (canvasCourseId) => [
	"canvas",
	canvasCourseId,
	"quizzes"
] };
var useCanvasQuizzesQuery = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	return useQuery({
		queryKey: canvasQuizKeys.quizzes(settings.canvasId),
		queryFn: async () => canvasQuizService.getAll(settings.canvasId)
	});
};
var useAddQuizToCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	const { data: canvasModules } = useCanvasModulesQuery();
	const addModule = useAddCanvasModuleMutation();
	return useMutation({
		mutationFn: async ({ quiz, moduleName }) => {
			if (!canvasModules) {
				console.log("cannot add quiz until modules loaded");
				return;
			}
			const assignmentGroup = settings.assignmentGroups.find((g) => g.name === quiz.localAssignmentGroupName);
			const canvasQuizId = await canvasQuizService.create(settings.canvasId, quiz, settings, assignmentGroup?.canvasId);
			const canvasModule = canvasModules.find((c) => c.name === moduleName);
			const moduleId = canvasModule ? canvasModule.id : await addModule.mutateAsync(moduleName);
			await canvasModuleService.createModuleItem(settings.canvasId, moduleId, quiz.name, "Quiz", canvasQuizId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasQuizKeys.quizzes(settings.canvasId) });
		}
	});
};
var useDeleteQuizFromCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (canvasQuizId) => {
			await canvasQuizService.delete(settings.canvasId, canvasQuizId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasQuizKeys.quizzes(settings.canvasId) });
		}
	});
};
//#endregion
//#region src/components/icons/CheckIcon.tsx
function CheckIcon() {
	return /* @__PURE__ */ jsx("svg", {
		className: "h-6",
		viewBox: "0 0 24 24",
		fill: "none",
		children: /* @__PURE__ */ jsx("path", {
			d: "M4 12.6111L8.92308 17.5L20 6.5",
			stroke: "green",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
//#endregion
export { useDeleteQuizFromCanvasMutation as a, useDeleteQuizMutation as c, useUpdateQuizMutation as d, useCanvasQuizzesQuery as i, useQuizQuery as l, canvasQuizKeys as n, escapeMatchingText as o, useAddQuizToCanvasMutation as r, useCreateQuizMutation as s, CheckIcon as t, useQuizzesQueries as u };
