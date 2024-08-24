import { describe, it, expect } from "vitest";
import { QuestionType } from "../../quiz/localQuizQuestion";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { quizQuestionMarkdownUtils } from "@/models/local/quiz/utils/quizQuestionMarkdownUtils";

describe("MatchingTests", () => {
  it("can parse matching question", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.questionType).toBe(QuestionType.MATCHING);
    expect(firstQuestion.text).not.toContain("statement");
    expect(firstQuestion.answers[0].matchedText).toBe(
      "a single command to be executed"
    );
  });

  it("can create markdown for matching question", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const questionMarkdown = quizQuestionMarkdownUtils.toMarkdown(
      quiz.questions[0]
    );
    const expectedMarkdown = `Points: 1
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)`;

    expect(questionMarkdown).toContain(expectedMarkdown);
  });

  it("whitespace is optional", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^statement - a single command to be executed
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    expect(quiz.questions[0].answers[0].text).toBe("statement");
  });

  it("can have distractors", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ - this is the distractor
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    expect(quiz.questions[0].matchDistractors).toEqual([
      "this is the distractor",
    ]);
  });

  it("can have distractors and be persisted", () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ - this is the distractor
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);

    expect(quizMarkdown).toContain(
      "^ statement - a single command to be executed\n^ - this is the distractor"
    );
  });
});
