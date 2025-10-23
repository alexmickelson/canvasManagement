import { describe, expect, it } from "vitest";
import { quizMarkdownUtils } from "../../quizzes/models/utils/quizMarkdownUtils";
import { QuestionType } from "../../quizzes/models/localQuizQuestion";

describe("numerical answer questions", () => {
  it("can parse question with numerical answers", () => {
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: quiz description
---
What is 2+3?
=   5
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.text).toBe("What is 2+3?");
    expect(question.questionType).toBe(QuestionType.NUMERICAL);
    expect(question.answers[0].numericAnswer).toBe(5);
  });
  it("can parse question with range answers", () => {
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: quiz description
---
What is the cube root of 2?
= [1.2598, 1.2600]
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.text).toBe("What is the cube root of 2?");
    expect(question.questionType).toBe(QuestionType.NUMERICAL);
    expect(question.answers[0].numericalAnswerType).toBe("range_answer");
    expect(question.answers[0].numericAnswerRangeMin).toBe(1.2598);
    expect(question.answers[0].numericAnswerRangeMax).toBe(1.26);
  });
});
