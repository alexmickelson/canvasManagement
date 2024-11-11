import { z } from "zod";
import {
  LocalQuizQuestionAnswer,
  zodLocalQuizQuestionAnswer,
} from "./localQuizQuestionAnswer";

export enum QuestionType {
  MULTIPLE_ANSWERS = "multiple_answers",
  MULTIPLE_CHOICE = "multiple_choice",
  ESSAY = "essay",
  SHORT_ANSWER = "short_answer",
  MATCHING = "matching",
  NONE = "",
}

export const zodQuestionType = z.enum([
  QuestionType.MULTIPLE_ANSWERS,
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.ESSAY,
  QuestionType.SHORT_ANSWER,
  QuestionType.MATCHING,
  QuestionType.NONE,
]);

export interface LocalQuizQuestion {
  text: string;
  questionType: QuestionType;
  points: number;
  answers: LocalQuizQuestionAnswer[];
  matchDistractors: string[];
}
export const zodLocalQuizQuestion = z.object({
  text: z.string(),
  questionType: zodQuestionType,
  points: z.number(),
  answers: zodLocalQuizQuestionAnswer.array(),
  matchDistractors: z.array(z.string()),
});
