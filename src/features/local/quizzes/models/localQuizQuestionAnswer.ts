import { z } from "zod";

export interface LocalQuizQuestionAnswer {
  correct: boolean;
  text: string;
  matchedText?: string;
}

export const zodLocalQuizQuestionAnswer = z.object({
  correct: z.boolean(),
  text: z.string(),
  matchedText: z.string().optional(),
});