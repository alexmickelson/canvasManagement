import { describe, it, expect } from "vitest";
import {
  RubricItem,
  rubricItemIsExtraCredit,
} from "../assignments/models/rubricItem";
import { assignmentMarkdownParser } from "../assignments/models/utils/assignmentMarkdownParser";
import { assignmentMarkdownSerializer } from "../assignments/models/utils/assignmentMarkdownSerializer";
import { AssignmentSubmissionType } from "../assignments/models/assignmentSubmissionType";

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

  it("can parse rubric item with sub-scores (ratings)", () => {
    const rawRubric = `- 10pts: Formatting
  - 10pts: proper margins, font size, spacing, contrast, and headings
  - 7pts: margins and font size correct but missing heading styles
  - 3pts: only paragraph spacing is acceptable`;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);

    expect(rubric.length).toBe(1);
    expect(rubric[0].points).toBe(10);
    expect(rubric[0].label).toBe("Formatting");
    expect(rubric[0].ratings).toHaveLength(3);
    expect(rubric[0].ratings![0]).toEqual({
      points: 10,
      description: "proper margins, font size, spacing, contrast, and headings",
    });
    expect(rubric[0].ratings![1]).toEqual({
      points: 7,
      description: "margins and font size correct but missing heading styles",
    });
    expect(rubric[0].ratings![2]).toEqual({
      points: 3,
      description: "only paragraph spacing is acceptable",
    });
  });

  it("can parse multiple rubric items where only some have sub-scores", () => {
    const rawRubric = `- 10pts: Formatting
  - 10pts: all formatting correct
  - 5pts: partial formatting
- 5pts: Submission quality`;

    const rubric: RubricItem[] =
      assignmentMarkdownParser.parseRubricMarkdown(rawRubric);

    expect(rubric.length).toBe(2);
    expect(rubric[0].label).toBe("Formatting");
    expect(rubric[0].ratings).toHaveLength(2);
    expect(rubric[1].label).toBe("Submission quality");
    expect(rubric[1].ratings).toBeUndefined();
  });

  it("items without sub-scores have no ratings field", () => {
    const rawRubric = `- 5pts: simple criterion`;
    const rubric = assignmentMarkdownParser.parseRubricMarkdown(rawRubric);
    expect(rubric[0].ratings).toBeUndefined();
  });

  it("serialize then deserialize preserves sub-scores unchanged", () => {
    const assignment = {
      name: "test",
      description: "desc",
      dueAt: "08/21/2023 23:59:00" as const,
      lockAt: undefined,
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      localAssignmentGroupName: "Homework",
      allowedFileUploadExtensions: [],
      rubric: [
        {
          points: 10,
          label: "Formatting",
          ratings: [
            {
              points: 10,
              description: "proper margins, font size, spacing",
            },
            { points: 5, description: "partial formatting" },
          ],
        },
        { points: 5, label: "Submission quality" },
      ],
    };

    const markdown = assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsed = assignmentMarkdownParser.parseMarkdown(markdown, "test");
    expect(parsed).toEqual(assignment);
  });
});
