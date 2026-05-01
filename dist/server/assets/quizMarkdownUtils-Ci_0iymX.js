import { i as quizFeedbackMarkdownUtils } from "./globalSettingsUtils-gIgphMXr.js";
import { c as verifyDateOrThrow, l as verifyDateStringOrUndefined } from "./timeUtils-DjiIXWRA.js";
import { t as QuestionType } from "./localQuizQuestion-DBCpCJHX.js";
//#region src/features/local/quizzes/models/utils/quizQuestionAnswerMarkdownUtils.ts
var _validFirstAnswerDelimiters = [
	"*a)",
	"a)",
	"*)",
	")",
	"[ ]",
	"[]",
	"[*]",
	"^",
	"="
];
var _multipleChoicePrefix = [
	"a)",
	"*a)",
	"*)",
	")"
];
var _multipleAnswerPrefix = [
	"[ ]",
	"[*]",
	"[]"
];
var parseNumericalAnswer = (input) => {
	const trimmedInput = input.replace(/^=\s*/, "").trim();
	const rangeNumbericAnswerMatch = trimmedInput.match(/^\[([^,]+),\s*([^\]]+)\]$/);
	if (rangeNumbericAnswerMatch) {
		const minValue = parseFloat(rangeNumbericAnswerMatch[1].trim());
		const maxValue = parseFloat(rangeNumbericAnswerMatch[2].trim());
		return {
			correct: true,
			text: input.trim(),
			numericalAnswerType: "range_answer",
			numericAnswerRangeMin: minValue,
			numericAnswerRangeMax: maxValue
		};
	}
	const numericValue = parseFloat(trimmedInput);
	return {
		correct: true,
		text: input.trim(),
		numericalAnswerType: "exact_answer",
		numericAnswer: numericValue
	};
};
var parseMatchingAnswer = (input) => {
	const [text, ...matchedParts] = input.replace(/^\^?/, "").split(" - ");
	return {
		correct: true,
		text: text.trim(),
		matchedText: matchedParts.join("-").trim()
	};
};
var getAnswerStringsWithMultilineSupport = (linesWithoutPoints, questionIndex) => {
	const indexOfAnswerStart = linesWithoutPoints.findIndex((l) => _validFirstAnswerDelimiters.some((prefix) => l.trimStart().startsWith(prefix)));
	if (indexOfAnswerStart === -1) {
		const debugLine = linesWithoutPoints.find((l) => l.trim().length > 0);
		throw Error(`question ${questionIndex + 1}: no answers when detecting question type on ${debugLine}`);
	}
	const answerLinesRaw = linesWithoutPoints.slice(indexOfAnswerStart);
	const answerStartPattern = /^(\*?[a-z]?\))|(?<!\S)\[\s*\]|\[\*\]|\^/;
	return answerLinesRaw.reduce((acc, line) => {
		if (answerStartPattern.test(line)) acc.push(line);
		else if (acc.length !== 0) acc[acc.length - 1] += "\n" + line;
		else acc.push(line);
		return acc;
	}, []);
};
var quizQuestionAnswerMarkdownUtils = {
	parseMarkdown(input, questionType) {
		if (questionType === QuestionType.NUMERICAL) return parseNumericalAnswer(input);
		const isCorrect = input.startsWith("*") || input[1] === "*";
		if (questionType === QuestionType.MATCHING) return parseMatchingAnswer(input);
		const startingQuestionPattern = /^(\*?[a-z]?\))|\[\s*\]|\[\*\]|\^ /;
		let replaceCount = 0;
		return {
			correct: isCorrect,
			text: input.replace(startingQuestionPattern, (m) => replaceCount++ === 0 ? "" : m).trim()
		};
	},
	isAnswerLine: (trimmedLine) => {
		return _validFirstAnswerDelimiters.some((prefix) => trimmedLine.startsWith(prefix));
	},
	getQuestionType: (linesWithoutPoints, questionIndex) => {
		const lastLine = linesWithoutPoints[linesWithoutPoints.length - 1].toLowerCase().trim();
		if (linesWithoutPoints.length === 0) return QuestionType.NONE;
		if (lastLine === "essay") return QuestionType.ESSAY;
		if (lastLine === "short answer") return QuestionType.SHORT_ANSWER;
		if (lastLine === "short_answer") return QuestionType.SHORT_ANSWER;
		if (lastLine === "short_answer=") return QuestionType.SHORT_ANSWER_WITH_ANSWERS;
		if (lastLine.startsWith("=")) return QuestionType.NUMERICAL;
		const firstAnswerLine = getAnswerStringsWithMultilineSupport(linesWithoutPoints, questionIndex)[0];
		if (_multipleChoicePrefix.some((prefix) => firstAnswerLine.startsWith(prefix))) return QuestionType.MULTIPLE_CHOICE;
		if (_multipleAnswerPrefix.some((prefix) => firstAnswerLine.startsWith(prefix))) return QuestionType.MULTIPLE_ANSWERS;
		if (firstAnswerLine.startsWith("^")) return QuestionType.MATCHING;
		return QuestionType.NONE;
	},
	getAnswers: (linesWithoutPoints, questionIndex, questionType) => {
		if (![
			QuestionType.MULTIPLE_CHOICE,
			QuestionType.MULTIPLE_ANSWERS,
			QuestionType.MATCHING,
			QuestionType.SHORT_ANSWER_WITH_ANSWERS,
			QuestionType.NUMERICAL
		].includes(questionType)) return {
			answers: [],
			distractors: []
		};
		if (questionType == QuestionType.SHORT_ANSWER_WITH_ANSWERS) linesWithoutPoints = linesWithoutPoints.slice(0, linesWithoutPoints.length - 1);
		const allAnswers = getAnswerStringsWithMultilineSupport(linesWithoutPoints, questionIndex).map((a) => quizQuestionAnswerMarkdownUtils.parseMarkdown(a, questionType));
		if (questionType === QuestionType.MATCHING) return {
			answers: allAnswers.filter((a) => a.text),
			distractors: allAnswers.filter((a) => !a.text).map((a) => a.matchedText ?? "")
		};
		return {
			answers: allAnswers,
			distractors: []
		};
	},
	getAnswerMarkdown: (question, answer, index) => {
		const multilineMarkdownCompatibleText = answer.text.startsWith("```") ? "\n" + answer.text : answer.text;
		if (question.questionType === "multiple_answers") return `${`[${answer.correct ? "*" : " "}] `}${multilineMarkdownCompatibleText}`;
		else if (question.questionType === "matching") return `^ ${answer.text} - ${answer.matchedText}`;
		else if (question.questionType === "numerical") {
			if (answer.numericalAnswerType === "range_answer") return `= [${answer.numericAnswerRangeMin}, ${answer.numericAnswerRangeMax}]`;
			return `= ${answer.numericAnswer}`;
		} else {
			const questionLetter = String.fromCharCode(97 + index);
			return `${`${answer.correct ? "*" : ""}${questionLetter}) `}${multilineMarkdownCompatibleText}`;
		}
	}
};
//#endregion
//#region src/features/local/quizzes/models/utils/quizQuestionMarkdownUtils.ts
var splitLinesAndPoints = (input) => {
	const firstLineIsPoints = input[0].toLowerCase().includes("points: ");
	const textHasPointsLine = input.length > 0 && input[0].includes(": ") && input[0].split(": ").length > 1 && !isNaN(parseFloat(input[0].split(": ")[1]));
	return {
		points: firstLineIsPoints && textHasPointsLine ? parseFloat(input[0].split(": ")[1]) : 1,
		lines: firstLineIsPoints ? input.slice(1) : input
	};
};
var getLinesBeforeAnswerLines = (lines) => {
	const { linesWithoutAnswers } = lines.reduce(({ linesWithoutAnswers, taking }, currentLine) => {
		if (!taking) return {
			linesWithoutAnswers,
			taking: false
		};
		if (quizQuestionAnswerMarkdownUtils.isAnswerLine(currentLine)) return {
			linesWithoutAnswers,
			taking: false
		};
		return {
			linesWithoutAnswers: [...linesWithoutAnswers, currentLine],
			taking: true
		};
	}, {
		linesWithoutAnswers: [],
		taking: true
	});
	return linesWithoutAnswers;
};
var removeQuestionTypeFromDescriptionLines = (linesWithoutAnswers, questionType) => {
	const questionTypesWithoutAnswers = [
		"essay",
		"short answer",
		"short_answer"
	];
	return questionTypesWithoutAnswers.includes(questionType) ? linesWithoutAnswers.filter((line) => !questionTypesWithoutAnswers.includes(line.toLowerCase())) : linesWithoutAnswers;
};
var quizQuestionMarkdownUtils = {
	toMarkdown(question, delimiters) {
		const answerArray = question.answers.map((a, i) => quizQuestionAnswerMarkdownUtils.getAnswerMarkdown(question, a, i));
		const distractorText = question.questionType === QuestionType.MATCHING ? question.matchDistractors?.map((d) => `\n^ - ${d}`).join("") ?? "" : "";
		const feedbackText = quizFeedbackMarkdownUtils.formatFeedback(question.correctComments, question.incorrectComments, question.neutralComments, delimiters);
		const answersText = answerArray.join("\n");
		const questionTypeIndicator = question.questionType === "essay" || question.questionType === "short_answer" ? question.questionType : question.questionType === QuestionType.SHORT_ANSWER_WITH_ANSWERS ? `\n${QuestionType.SHORT_ANSWER_WITH_ANSWERS}` : "";
		return `Points: ${question.points}\n${question.text}\n${feedbackText}${answersText}${distractorText}${questionTypeIndicator}`;
	},
	parseMarkdown(input, questionIndex, delimiters) {
		const { points, lines } = splitLinesAndPoints(input.trim().split("\n"));
		const linesWithoutAnswers = getLinesBeforeAnswerLines(lines);
		const questionType = quizQuestionAnswerMarkdownUtils.getQuestionType(lines, questionIndex);
		const linesWithoutAnswersAndTypes = removeQuestionTypeFromDescriptionLines(linesWithoutAnswers, questionType);
		const { correctComments, incorrectComments, neutralComments, otherLines: descriptionLines } = quizFeedbackMarkdownUtils.extractFeedback(linesWithoutAnswersAndTypes, delimiters);
		const { answers, distractors } = quizQuestionAnswerMarkdownUtils.getAnswers(lines, questionIndex, questionType);
		return {
			text: descriptionLines.join("\n"),
			questionType,
			points,
			answers,
			matchDistractors: distractors,
			correctComments,
			incorrectComments,
			neutralComments
		};
	}
};
//#endregion
//#region src/features/local/quizzes/models/utils/quizMarkdownUtils.ts
var extractLabelValue = (input, label) => {
	const match = new RegExp(`${label}: (.*?)\n`).exec(input);
	return match ? match[1].trim() : "";
};
var extractDescription = (input) => {
	const match = (/* @__PURE__ */ new RegExp("Description: (.*?)$", "s")).exec(input);
	return match ? match[1].trim() : "";
};
var parseBooleanOrThrow = (value, label) => {
	if (value.toLowerCase() === "true") return true;
	if (value.toLowerCase() === "false") return false;
	throw new Error(`Error with ${label}: ${value}`);
};
var parseBooleanOrDefault = (value, label, defaultValue) => {
	if (value.toLowerCase() === "true") return true;
	if (value.toLowerCase() === "false") return false;
	return defaultValue;
};
var parseNumberOrThrow = (value, label) => {
	const parsed = parseInt(value, 10);
	if (isNaN(parsed)) throw new Error(`Error with ${label}: ${value}`);
	return parsed;
};
var getQuizWithOnlySettings = (settings, name) => {
	const shuffleAnswers = parseBooleanOrThrow(extractLabelValue(settings, "ShuffleAnswers"), "ShuffleAnswers");
	const password = extractLabelValue(settings, "Password") || void 0;
	const showCorrectAnswers = parseBooleanOrDefault(extractLabelValue(settings, "ShowCorrectAnswers"), "ShowCorrectAnswers", true);
	const oneQuestionAtATime = parseBooleanOrThrow(extractLabelValue(settings, "OneQuestionAtATime"), "OneQuestionAtATime");
	const allowedAttempts = parseNumberOrThrow(extractLabelValue(settings, "AllowedAttempts"), "AllowedAttempts");
	const dueAt = verifyDateOrThrow(extractLabelValue(settings, "DueAt"), "DueAt");
	const lockAt = verifyDateStringOrUndefined(extractLabelValue(settings, "LockAt"));
	return {
		name,
		description: extractDescription(settings),
		password,
		lockAt,
		dueAt,
		shuffleAnswers,
		showCorrectAnswers,
		oneQuestionAtATime,
		localAssignmentGroupName: extractLabelValue(settings, "AssignmentGroup"),
		allowedAttempts,
		questions: []
	};
};
var quizMarkdownUtils = {
	toMarkdown(quiz, delimiters) {
		if (!quiz) throw Error(`quiz was undefined, cannot parse markdown`);
		if (typeof quiz.questions === "undefined" || typeof quiz.oneQuestionAtATime === "undefined") {
			console.log("quiz is probably not a quiz", quiz);
			throw Error(`quiz ${quiz.name} is probably not a quiz`);
		}
		const questionMarkdown = quiz.questions.map((q) => quizQuestionMarkdownUtils.toMarkdown(q, delimiters)).join("\n\n---\n\n");
		return `LockAt: ${quiz.lockAt ?? ""}
DueAt: ${quiz.dueAt}
Password: ${quiz.password ?? ""}
ShuffleAnswers: ${quiz.shuffleAnswers.toString().toLowerCase()}
ShowCorrectAnswers: ${quiz.showCorrectAnswers.toString().toLowerCase()}
OneQuestionAtATime: ${quiz.oneQuestionAtATime.toString().toLowerCase()}
AssignmentGroup: ${quiz.localAssignmentGroupName}
AllowedAttempts: ${quiz.allowedAttempts}
Description: ${quiz.description}
---
${questionMarkdown}`;
	},
	parseMarkdown(input, name, delimiters) {
		const splitInput = input.split("---\n");
		const settings = splitInput[0];
		const quizWithoutQuestions = getQuizWithOnlySettings(settings, name);
		const questions = splitInput.slice(1).filter((str) => str.trim().length > 0).map((q, i) => quizQuestionMarkdownUtils.parseMarkdown(q, i, delimiters));
		return {
			...quizWithoutQuestions,
			questions
		};
	}
};
//#endregion
export { quizMarkdownUtils as t };
