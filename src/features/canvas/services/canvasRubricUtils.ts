import { RubricItem } from "@/features/local/assignments/models/rubricItem";

export const getRubricCriterion = (rubric: RubricItem[]) => {
  const criterion = rubric
    .map((rubricItem) => ({
      description: rubricItem.label,
      points: rubricItem.points,
      ratings: {
        0: { description: "Full Marks", points: rubricItem.points },
        1: { description: "No Marks", points: 0 },
      },
    }))
    .reduce((acc, item, index) => {
      return {
        ...acc,
        [index]: item,
      };
    }, {} as { [key: number]: { description: string; points: number; ratings: { [key: number]: { description: string; points: number } } } });

  return criterion;
};
