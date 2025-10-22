import { describe, it, expect } from "vitest";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";

describe("Question Feedback options", () => {
  it("essay questions can have feedback", () => {
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
this is the description
... this is general feedback
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.questionType).toBe(QuestionType.ESSAY);
    expect(firstQuestion.text).not.toContain("this is general feedback");
    expect(firstQuestion.neutralComments).toBe("this is general feedback");
  });
});
