import { RubricItem } from "@/features/local/assignments/models/rubricItem";

export const getRubricCriterion = (rubric: RubricItem[]) => {
  const criterion = rubric
    .map((rubricItem) => {
      const ratings =
        rubricItem.ratings && rubricItem.ratings.length > 0
          ? rubricItem.ratings.reduce(
              (acc, rating, i) => ({
                ...acc,
                [i]: { description: rating.description, points: rating.points },
              }),
              {} as { [key: number]: { description: string; points: number } }
            )
          : {
              0: { description: "Full Marks", points: rubricItem.points },
              1: { description: "No Marks", points: 0 },
            };

      return {
        description: rubricItem.label,
        points: rubricItem.points,
        ratings,
      };
    })
    .reduce(
      (acc, item, index) => ({ ...acc, [index]: item }),
      {} as {
        [key: number]: {
          description: string;
          points: number;
          ratings: { [key: number]: { description: string; points: number } };
        };
      }
    );

  return criterion;
};
