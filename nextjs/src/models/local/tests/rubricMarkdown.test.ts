import { describe, it, expect } from "vitest";
import { RubricItem, rubricItemIsExtraCredit } from "../assignmnet/rubricItem";
import { assignmentMarkdownParser } from "../assignmnet/utils/assignmentMarkdownParser";

describe("RubricMarkdownTests", () => {
  it("can parse one item", () => {
    const rawRubric = `
      - 2pts: this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric.length).toBe(1);
    expect(rubricItemIsExtraCredit(rubric[0])).toBe(false);
    expect(rubric[0].label).toBe("this is the task");
    expect(rubric[0].points).toBe(2);
  });

  it("can parse multiple items", () => {
    const rawRubric = `
      - 2pts: this is the task
      - 3pts: this is the other task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric.length).toBe(2);
    expect(rubricItemIsExtraCredit(rubric[0])).toBe(false);
    expect(rubric[1].label).toBe("this is the other task");
    expect(rubric[1].points).toBe(3);
  });

  it("can parse single point", () => {
    const rawRubric = `
      - 1pt: this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);

    expect(rubricItemIsExtraCredit(rubric[0])).toBe(false);
    expect(rubric[0].label).toBe("this is the task");
    expect(rubric[0].points).toBe(1);
  });

  it("can parse single extra credit (lower case)", () => {
    const rawRubric = `
      - 1pt: (extra credit) this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubricItemIsExtraCredit(rubric[0])).toBe(true);
    expect(rubric[0].label).toBe("(extra credit) this is the task");
  });

  it("can parse single extra credit (upper case)", () => {
    const rawRubric = `
      - 1pt: (Extra Credit) this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubricItemIsExtraCredit(rubric[0])).toBe(true);
    expect(rubric[0].label).toBe("(Extra Credit) this is the task");
  });

  it("can parse floating point numbers", () => {
    const rawRubric = `
      - 1.5pt: this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric[0].points).toBe(1.5);
  });

  it("can parse negative numbers", () => {
    const rawRubric = `
      - -2pt: this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric[0].points).toBe(-2);
  });

  it("can parse negative floating point numbers", () => {
    const rawRubric = `
      - -2895.00053pt: this is the task
    `;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric[0].points).toBe(-2895.00053);
  });
});
