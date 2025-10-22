import { z } from "zod";
import { zodLocalQuizQuestion } from "./localQuizQuestion";
import { IModuleItem } from "@/features/local/modules/IModuleItem";

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

export interface LocalQuiz extends IModuleItem, z.infer<typeof zodLocalQuiz> {}
