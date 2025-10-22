import { z } from "zod";
import { zodLocalQuizQuestionAnswer } from "./localQuizQuestionAnswer";

export const zodQuestionType = z.enum([
  "multiple_answers",
  "multiple_choice",
  "essay",
  "short_answer",
  "matching",
  "",
  "short_answer=",
  "numerical",
]);

export const QuestionType = {
  MULTIPLE_ANSWERS: "multiple_answers",
  MULTIPLE_CHOICE: "multiple_choice",
  ESSAY: "essay",
  SHORT_ANSWER: "short_answer",
  MATCHING: "matching",
  NONE: "",
  SHORT_ANSWER_WITH_ANSWERS: "short_answer=",
  NUMERICAL: "numerical",
} as const;

export type QuestionType = z.infer<typeof zodQuestionType>;

export const zodLocalQuizQuestion = z.object({
  text: z.string(),
  questionType: zodQuestionType,
  points: z.number(),
  answers: zodLocalQuizQuestionAnswer.array(),
  matchDistractors: z.array(z.string()),
  correctComments: z.string().optional(),
  incorrectComments: z.string().optional(),
  neutralComments: z.string().optional(),
});
export type LocalQuizQuestion = z.infer<typeof zodLocalQuizQuestion>;
