import { z } from "zod";

export const zodLocalQuizQuestionAnswer = z.object({
  correct: z.boolean(),
  text: z.string(),
  matchedText: z
    .string()
    .optional()
    .describe("Matching pair text for matching questions"),
  numericalAnswerType: z
    .enum(["exact_answer", "range_answer", "precision_answer"])
    .optional(),
  numericAnswer: z.number().optional(),
  numericAnswerRangeMin: z
    .number()
    .optional()
    .describe("Minimum value for range answers"),
  numericAnswerRangeMax: z
    .number()
    .optional()
    .describe("Maximum value for range answers"),
  numericAnswerMargin: z
    .number()
    .optional()
    .describe("Allowed margin for precision answers"),
});

export type LocalQuizQuestionAnswer = z.infer<
  typeof zodLocalQuizQuestionAnswer
>;
