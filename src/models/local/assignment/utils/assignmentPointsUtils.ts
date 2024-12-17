import { RubricItem } from "../rubricItem";

export const assignmentPoints = (rubric: RubricItem[]) => {
  const basePoints = rubric
    .map((r) => {
      if (r.label.toLowerCase().includes("(extra credit)")) return 0;
      if (r.points < 0) return 0; // don't count negative points towards the point totals
      return r.points;
    })
    .reduce((acc, current) => (current > 0 ? acc + current : acc), 0);
  return basePoints;
};
