import { z } from "zod";
import { zodLocalQuizQuestion } from "./localQuizQuestion";
import { IModuleItem } from "@/features/local/modules/IModuleItem";

export const zodLocalQuiz = z.object({
  name: z.string(),
  description: z.string(),
  password: z
    .string()
    .optional()
    .describe("Password required to access the quiz"),
  lockAt: z.string().optional(),
  dueAt: z.string(),
  shuffleAnswers: z.boolean(),
  showCorrectAnswers: z
    .boolean()
    .describe("Whether to show correct answers after submission"),
  oneQuestionAtATime: z.boolean(),
  localAssignmentGroupName: z.string().optional(),
  allowedAttempts: z
    .number()
    .describe("Number of allowed attempts (-1 for unlimited)"),
  questions: zodLocalQuizQuestion.array(),
});

export interface LocalQuiz extends IModuleItem, z.infer<typeof zodLocalQuiz> {}
