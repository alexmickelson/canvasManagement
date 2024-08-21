import { LocalQuizQuestionAnswer } from "./localQuizQuestionAnswer";

export interface LocalQuizQuestion {
  text: string;
  questionType: QuestionType;
  points: number;
  answers: LocalQuizQuestionAnswer[];
}

export enum QuestionType {
  MULTIPLE_ANSWERS = "multiple_answers",
  MULTIPLE_CHOICE = "multiple_choice",
  ESSAY = "essay",
  SHORT_ANSWER = "short_answer",
  MATCHING = "matching",
  NONE = "",
}
