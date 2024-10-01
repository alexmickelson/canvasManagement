import { RubricItem } from "@/models/local/assignment/rubricItem";
import { describe, expect, it } from "vitest";
import { getRubricCriterion } from "./canvasRubricUtils";

describe("can prepare rubric for canvas", () =>{
  it("can parse normal rubric into criterion", () =>{
    const rubric: RubricItem[] = [
      {
        label: "first",
        points: 1
      },
      {
        label: "second",
        points: 2
      },
    ]
    const criterion = getRubricCriterion(rubric)

    expect(criterion).toStrictEqual({
      0: {
        description: "first",
        points: 1,
        ratings: {
          0: { description: "Full Marks", points: 1 },
          1: { description: "No Marks", points: 0 },
        }
      },
      1: {
        description: "second",
        points: 2,
        ratings: {
          0: { description: "Full Marks", points: 2 },
          1: { description: "No Marks", points: 0 },
        }
      }
    })
  })


  it("can parse negative rubric into criterion", () =>{
    const rubric: RubricItem[] = [
      {
        label: "first",
        points: 1
      },
      {
        label: "second",
        points: -2
      },
    ]
    const criterion = getRubricCriterion(rubric)

    expect(criterion).toStrictEqual({
      0: {
        description: "first",
        points: 1,
        ratings: {
          0: { description: "Full Marks", points: 1 },
          1: { description: "No Marks", points: 0 },
        }
      },
      1: {
        description: "second",
        points: -2,
        ratings: {
          0: { description: "Full Marks", points: -2 },
          1: { description: "No Marks", points: 0 },
        }
      }
    })
  })
})