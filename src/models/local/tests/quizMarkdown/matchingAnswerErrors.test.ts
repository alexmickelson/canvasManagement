import { describe, it, expect } from "vitest";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";

describe("Matching Answer Error Messages", () => {
  it("can parse matching question", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---

question without answer

`;

    expect(() => quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz)).toThrowError(
      /question type/
    );
  });
});
