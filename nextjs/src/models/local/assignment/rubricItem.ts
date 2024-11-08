import { z } from "zod";

export interface RubricItem {
  label: string;
  points: number;
}

export const zodRubricItem = z.object({
  label: z.string(),
  points: z.number(),
});

export const rubricItemIsExtraCredit = (item: RubricItem) => {
  const extraCredit = "(extra credit)";
  return item.label.toLowerCase().includes(extraCredit.toLowerCase());
};
