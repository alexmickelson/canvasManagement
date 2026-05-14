import { z } from "zod";

export interface RubricRating {
  points: number;
  description: string;
}

export interface RubricItem {
  label: string;
  points: number;
  ratings?: RubricRating[];
}

export const zodRubricRating = z.object({
  points: z.number(),
  description: z.string(),
});

export const zodRubricItem = z.object({
  label: z.string(),
  points: z.number(),
  ratings: z.array(zodRubricRating).optional(),
});

export const rubricItemIsExtraCredit = (item: RubricItem) => {
  const extraCredit = "(extra credit)";
  return item.label.toLowerCase().includes(extraCredit.toLowerCase());
};
