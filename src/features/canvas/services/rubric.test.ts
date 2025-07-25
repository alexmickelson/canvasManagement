import { RubricItem } from "@/features/local/assignments/models/rubricItem";
import { describe, expect, it } from "vitest";
import { getRubricCriterion } from "./canvasRubricUtils";
import { assignmentPoints } from "@/features/local/assignments/models/utils/assignmentPointsUtils";

describe("can prepare rubric for canvas", () => {
  it("can parse normal rubric into criterion", () => {
    const rubric: RubricItem[] = [
      {
        label: "first",
        points: 1,
      },
      {
        label: "second",
        points: 2,
      },
    ];
    const criterion = getRubricCriterion(rubric);

    expect(criterion).toStrictEqual({
      0: {
        description: "first",
        points: 1,
        ratings: {
          0: { description: "Full Marks", points: 1 },
          1: { description: "No Marks", points: 0 },
        },
      },
      1: {
        description: "second",
        points: 2,
        ratings: {
          0: { description: "Full Marks", points: 2 },
          1: { description: "No Marks", points: 0 },
        },
      },
    });
  });

  it("can parse negative rubric into criterion", () => {
    const rubric: RubricItem[] = [
      {
        label: "first",
        points: 1,
      },
      {
        label: "second",
        points: -2,
      },
    ];
    const criterion = getRubricCriterion(rubric);

    expect(criterion).toStrictEqual({
      0: {
        description: "first",
        points: 1,
        ratings: {
          0: { description: "Full Marks", points: 1 },
          1: { description: "No Marks", points: 0 },
        },
      },
      1: {
        description: "second",
        points: -2,
        ratings: {
          0: { description: "Full Marks", points: -2 },
          1: { description: "No Marks", points: 0 },
        },
      },
    });
  });

  it("negative rubric items do not contribute to the total", () => {
    const rubric: RubricItem[] = [
      {
        label: "first",
        points: 1,
      },
      {
        label: "second",
        points: -2,
      },
      {
        label: "second",
        points: 3,
      },
    ];
    const points = assignmentPoints(rubric);
    expect(points).toBe(4);
  });
});
