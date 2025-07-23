import { z } from "zod";
import { LocalQuizQuestion, zodLocalQuizQuestion } from "./localQuizQuestion";
import { quizMarkdownUtils } from "./utils/quizMarkdownUtils";
import { IModuleItem } from "@/models/local/IModuleItem";

export interface LocalQuiz extends IModuleItem {
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

export const zodLocalQuiz = z.object({
  name: z.string(),
  description: z.string(),
  password: z.string().optional(),
  lockAt: z.string().optional(),
  dueAt: z.string(),
  shuffleAnswers: z.boolean(),
  showCorrectAnswers: z.boolean(),
  oneQuestionAtATime: z.boolean(),
  localAssignmentGroupName: z.string().optional(),
  allowedAttempts: z.number(),
  questions: zodLocalQuizQuestion.array(),
});

export const localQuizMarkdownUtils = {
  parseMarkdown: quizMarkdownUtils.parseMarkdown,
  toMarkdown: quizMarkdownUtils.toMarkdown,
};
