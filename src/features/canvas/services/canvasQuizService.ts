import { CanvasQuiz } from "@/features/canvas/models/quizzes/canvasQuizModel";
import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { getDateFromStringOrThrow } from "@/features/local/utils/timeUtils";
import { canvasAssignmentService } from "./canvasAssignmentService";
import { CanvasQuizQuestion } from "@/features/canvas/models/quizzes/canvasQuizQuestionModel";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import {
  LocalQuizQuestion,
  QuestionType,
} from "@/features/local/quizzes/models/localQuizQuestion";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { escapeMatchingText } from "@/services/utils/questionHtmlUtils";
import {
  rateLimitAwareDelete,
  rateLimitAwarePost,
} from "./canvasWebRequestUtils";

export const getAnswersForCanvas = (
  question: LocalQuizQuestion,
  settings: LocalCourseSettings
) => {
  if (question.questionType === QuestionType.MATCHING)
    return question.answers.map((a) => {
      const text =
        question.questionType === QuestionType.MATCHING
          ? escapeMatchingText(a.text)
          : a.text;
      return {
        answer_match_left: text,
        answer_match_right: a.matchedText,
      };
    });

  if (question.questionType === QuestionType.NUMERICAL) {
    return question.answers.map((answer) => ({
      numerical_answer_type: answer.numericalAnswerType,
      exact: answer.numericAnswer,
    }));
  }

  return question.answers.map((answer) => ({
    answer_html: markdownToHTMLSafe({ markdownString: answer.text, settings }),
    answer_weight: answer.correct ? 100 : 0,
    answer_text: answer.text,
  }));
};

export const getQuestionTypeForCanvas = (question: LocalQuizQuestion) => {
  return `${question.questionType.replace("=", "")}_question`;
};

const createQuestionOnly = async (
  canvasCourseId: number,
  canvasQuizId: number,
  question: LocalQuizQuestion,
  position: number,
  settings: LocalCourseSettings
) => {
  console.log("Creating individual question"); //, question);

  const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/questions`;

  console.log(question);
  const body = {
    question: {
      question_text: markdownToHTMLSafe({
        markdownString: question.text,
        settings,
      }),
      question_type: getQuestionTypeForCanvas(question),
      points_possible: question.points,
      position,
      answers: getAnswersForCanvas(question, settings),
      correct_comments: question.incorrectComments,
      incorrect_comments: question.incorrectComments,
      neutral_comments: question.neutralComments,
    },
  };

  const response = await rateLimitAwarePost<CanvasQuizQuestion>(url, body);
  const newQuestion = response.data;

  if (!newQuestion) throw new Error("Created question is null");

  return { question: newQuestion, position };
};

const hackFixQuestionOrdering = async (
  canvasCourseId: number,
  canvasQuizId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questionAndPositions: Array<{ question: any; position: number }>
) => {
  console.log("Fixing question order");

  const order = questionAndPositions.map((qp) => ({
    type: "question",
    id: qp.question.id.toString(),
  }));

  const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/reorder`;
  await rateLimitAwarePost(url, { order });
};

const verifyQuestionOrder = async (
  canvasCourseId: number,
  canvasQuizId: number,
  localQuiz: LocalQuiz
): Promise<boolean> => {
  console.log("Verifying question order in Canvas quiz");

  try {
    const canvasQuestions = await canvasQuizService.getQuizQuestions(
      canvasCourseId,
      canvasQuizId
    );

    // Check if the number of questions matches
    if (canvasQuestions.length !== localQuiz.questions.length) {
      console.error(
        `Question count mismatch: Canvas has ${canvasQuestions.length}, local quiz has ${localQuiz.questions.length}`
      );
      return false;
    }

    // Verify that questions are in the correct order by comparing text content
    // We'll use a simple approach: strip HTML tags and compare the core text content
    const stripHtml = (html: string): string => {
      return html.replace(/<[^>]*>/g, "").trim();
    };

    for (let i = 0; i < localQuiz.questions.length; i++) {
      const localQuestion = localQuiz.questions[i];
      const canvasQuestion = canvasQuestions[i];

      const localQuestionText = localQuestion.text.trim();
      const canvasQuestionText = stripHtml(canvasQuestion.question_text).trim();

      // Check if the question text content matches (allowing for HTML conversion differences)
      if (
        !canvasQuestionText.includes(localQuestionText) &&
        !localQuestionText.includes(canvasQuestionText)
      ) {
        console.error(
          `Question order mismatch at position ${i}:`,
          `Local: "${localQuestionText}"`,
          `Canvas: "${canvasQuestionText}"`
        );
        return false;
      }

      // Verify position is correct
      if (
        canvasQuestion.position !== undefined &&
        canvasQuestion.position !== i + 1
      ) {
        console.error(
          `Question position mismatch at index ${i}: Canvas position is ${
            canvasQuestion.position
          }, expected ${i + 1}`
        );
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

const hackFixRedundantAssignments = async (canvasCourseId: number) => {
  console.log("hack fixing redundant quiz assignments that are auto-created");
  const assignments = await canvasAssignmentService.getAll(canvasCourseId);
  const assignmentsToDelete = assignments.filter(
    (assignment) =>
      !assignment.is_quiz_assignment &&
      assignment.submission_types.includes("online_quiz")
  );

  await Promise.all(
    assignmentsToDelete.map(
      async (assignment) =>
        await canvasAssignmentService.delete(
          canvasCourseId,
          assignment.id,
          assignment.name
        )
    )
  );

  console.log(`Deleted ${assignmentsToDelete.length} redundant assignments`);
};

const createQuizQuestions = async (
  canvasCourseId: number,
  canvasQuizId: number,
  localQuiz: LocalQuiz,
  settings: LocalCourseSettings
) => {
  console.log("Creating quiz questions"); //, localQuiz);

  const tasks = localQuiz.questions.map(
    async (question, index) =>
      await createQuestionOnly(
        canvasCourseId,
        canvasQuizId,
        question,
        index,
        settings
      )
  );
  const questionAndPositions = await Promise.all(tasks);
  await hackFixQuestionOrdering(
    canvasCourseId,
    canvasQuizId,
    questionAndPositions
  );
  await hackFixRedundantAssignments(canvasCourseId);

  // Verify that the question order in Canvas matches the local quiz order
  const orderVerified = await verifyQuestionOrder(
    canvasCourseId,
    canvasQuizId,
    localQuiz
  );

  if (!orderVerified) {
    console.warn(
      "Question order verification failed! The quiz was created but the question order may not match the intended order."
    );
  }
};

export const canvasQuizService = {
  async getAll(canvasCourseId: number): Promise<CanvasQuiz[]> {
    try {
      const url = `${canvasApi}/courses/${canvasCourseId}/quizzes`;
      const quizzes = await paginatedRequest<CanvasQuiz[]>({ url });
      return quizzes.map((quiz) => ({
        ...quiz,
        due_at: quiz.due_at
          ? new Date(quiz.due_at).toLocaleString()
          : undefined,
        lock_at: quiz.lock_at
          ? new Date(quiz.lock_at).toLocaleString()
          : undefined,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 403) {
        console.log(
          "Canvas API error: 403 Forbidden for quizzes. Returning empty array."
        );
        return [];
      }
      throw error;
    }
  },

  async getQuizQuestions(
    canvasCourseId: number,
    canvasQuizId: number
  ): Promise<CanvasQuizQuestion[]> {
    try {
      const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/questions`;
      const questions = await paginatedRequest<CanvasQuizQuestion[]>({ url });
      // Sort by position to ensure correct order
      return questions.sort((a, b) => (a.position || 0) - (b.position || 0));
    } catch (error) {
      console.error("Error fetching quiz questions from Canvas:", error);
      throw error;
    }
  },

  async create(
    canvasCourseId: number,
    localQuiz: LocalQuiz,
    settings: LocalCourseSettings,
    canvasAssignmentGroupId?: number
  ) {
    console.log("Creating quiz", localQuiz);

    const url = `${canvasApi}/courses/${canvasCourseId}/quizzes`;

    const body = {
      quiz: {
        title: localQuiz.name,
        description: markdownToHTMLSafe({
          markdownString: localQuiz.description,
          settings,
        }),
        shuffle_answers: localQuiz.shuffleAnswers,
        access_code: localQuiz.password,
        show_correct_answers: localQuiz.showCorrectAnswers,
        allowed_attempts: localQuiz.allowedAttempts,
        one_question_at_a_time: localQuiz.oneQuestionAtATime,
        cant_go_back: false,
        due_at: localQuiz.dueAt
          ? getDateFromStringOrThrow(
              localQuiz.dueAt,
              "creating quiz"
            ).toISOString()
          : undefined,
        lock_at: localQuiz.lockAt
          ? getDateFromStringOrThrow(
              localQuiz.lockAt,
              "creating quiz"
            ).toISOString()
          : undefined,
        assignment_group_id: canvasAssignmentGroupId,
      },
    };

    const { data: canvasQuiz } = await rateLimitAwarePost<CanvasQuiz>(
      url,
      body
    );
    await createQuizQuestions(
      canvasCourseId,
      canvasQuiz.id,
      localQuiz,
      settings
    );
    return canvasQuiz.id;
  },
  async delete(canvasCourseId: number, canvasQuizId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}`;
    await rateLimitAwareDelete(url);
  },
};
