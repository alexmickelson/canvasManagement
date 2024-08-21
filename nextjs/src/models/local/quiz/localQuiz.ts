import { LocalQuizQuestion } from "./localQuizQuestion";

export interface LocalQuiz {
  name: string;
  description: string;
  password?: string;
  lockAt?: string; // ISO 8601 date string
  dueAt: string; // ISO 8601 date string
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  oneQuestionAtATime: boolean;
  localAssignmentGroupName?: string;
  allowedAttempts: number;
  questions: LocalQuizQuestion[];
}
