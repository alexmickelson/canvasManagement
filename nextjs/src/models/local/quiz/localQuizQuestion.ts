import { LocalQuizQuestionAnswer } from "./localQuizQuestionAnswer";

export interface LocalQuizQuestion {
  text: string;
  questionType: QuestionType;
  points: number;
  answers: LocalQuizQuestionAnswer[];
}

export enum QuestionType {
  MultipleAnswers = "multiple_answers",
  MultipleChoice = "multiple_choice",
  Essay = "essay",
  ShortAnswer = "short_answer",
  Matching = "matching"
}
