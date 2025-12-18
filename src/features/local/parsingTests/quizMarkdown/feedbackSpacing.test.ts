import { describe, it, expect } from "vitest";
import { quizQuestionMarkdownUtils } from "@/features/local/quizzes/models/utils/quizQuestionMarkdownUtils";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";

describe("feedback spacing", () => {
  it("adds a blank line after feedback before answers", () => {
    const question = {
      text: "What is 2+2?",
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 1,
      answers: [
        { correct: true, text: "4" },
      ],
      matchDistractors: [],
      correctComments: "Good",
      incorrectComments: "No",
      neutralComments: "Note",
    } as any;

    const md = quizQuestionMarkdownUtils.toMarkdown(question as any);

    // look for double newline separating feedback block and answer marker
    expect(md).toMatch(/\n\n\*?a\)/);
  });
});
