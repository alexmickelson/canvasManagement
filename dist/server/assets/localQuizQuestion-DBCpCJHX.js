import { z } from "zod";
//#region src/features/local/quizzes/models/localQuizQuestionAnswer.ts
var zodLocalQuizQuestionAnswer = z.object({
	correct: z.boolean(),
	text: z.string(),
	matchedText: z.string().optional(),
	numericalAnswerType: z.enum([
		"exact_answer",
		"range_answer",
		"precision_answer"
	]).optional(),
	numericAnswer: z.number().optional(),
	numericAnswerRangeMin: z.number().optional(),
	numericAnswerRangeMax: z.number().optional(),
	numericAnswerMargin: z.number().optional()
});
//#endregion
//#region src/features/local/quizzes/models/localQuizQuestion.ts
var zodQuestionType = z.enum([
	"multiple_answers",
	"multiple_choice",
	"essay",
	"short_answer",
	"matching",
	"",
	"short_answer=",
	"numerical"
]);
var QuestionType = {
	MULTIPLE_ANSWERS: "multiple_answers",
	MULTIPLE_CHOICE: "multiple_choice",
	ESSAY: "essay",
	SHORT_ANSWER: "short_answer",
	MATCHING: "matching",
	NONE: "",
	SHORT_ANSWER_WITH_ANSWERS: "short_answer=",
	NUMERICAL: "numerical"
};
var zodLocalQuizQuestion = z.object({
	text: z.string(),
	questionType: zodQuestionType,
	points: z.number(),
	answers: zodLocalQuizQuestionAnswer.array(),
	matchDistractors: z.array(z.string()),
	correctComments: z.string().optional(),
	incorrectComments: z.string().optional(),
	neutralComments: z.string().optional()
});
//#endregion
export { zodLocalQuizQuestion as n, QuestionType as t };
