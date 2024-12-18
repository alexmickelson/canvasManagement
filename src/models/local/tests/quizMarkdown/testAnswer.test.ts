import { QuestionType } from "../../quiz/localQuizQuestion";
import { quizMarkdownUtils } from "../../quiz/utils/quizMarkdownUtils";
import { quizQuestionMarkdownUtils } from "../../quiz/utils/quizQuestionMarkdownUtils";
import { describe, it, expect } from "vitest";

describe("TextAnswerTests", () => {
  it("can parse essay", () => {
    const name = "Test Quiz"
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.ESSAY);
    expect(firstQuestion.text).not.toContain("essay");
  });

  it("can parse short answer", () => {
    const name = "Test Quiz"
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.SHORT_ANSWER);
    expect(firstQuestion.text).not.toContain("short answer");
  });

  it("short answer to markdown is correct", () => {

    const name = "Test Quiz"
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    const questionMarkdown =
      quizQuestionMarkdownUtils.toMarkdown(firstQuestion);
    const expectedMarkdown = `Points: 1
Which events are triggered when the user clicks on an input field?
short_answer`;
    expect(questionMarkdown).toContain(expectedMarkdown);
  });

  it("essay question to markdown is correct", () => {
    const name = "Test Quiz"
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    const questionMarkdown =
      quizQuestionMarkdownUtils.toMarkdown(firstQuestion);
    const expectedMarkdown = `Points: 1
Which events are triggered when the user clicks on an input field?
essay`;
    expect(questionMarkdown).toContain(expectedMarkdown);
  });

//   it("Can parse short answer with auto graded answers", () => {
//     const rawMarkdownQuiz = `
// Name: Test Quiz
// ShuffleAnswers: true
// OneQuestionAtATime: false
// DueAt: 08/21/2023 23:59:00
// LockAt: 08/21/2023 23:59:00
// AssignmentGroup: Assignments
// AllowedAttempts: -1
// Description: this is the 
// multi line
// description
// ---
// Which events are triggered when the user clicks on an input field?
// *a) test
// short_answer=
// `;

//     const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
//     const firstQuestion = quiz.questions[0];


//     expect(firstQuestion.questionType).toBe(QuestionType.SHORT_ANSWER_WITH_ANSWERS)
//   });
});
