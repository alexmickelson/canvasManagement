import { z } from "zod";

export const zodLocalQuizQuestionAnswer = z.object({
  correct: z.boolean(),
  text: z.string(),
  matchedText: z.string().optional(),
  numericalAnswerType: z
    .enum(["exact_answer", "range_answer", "precision_answer"])
    .optional(),
  numericAnswer: z.number().optional(),
  numericAnswerRangeMin: z.number().optional(),
  numericAnswerRangeMax: z.number().optional(),
  numericAnswerMargin: z.number().optional(),
});

export type LocalQuizQuestionAnswer = z.infer<
  typeof zodLocalQuizQuestionAnswer
>;
