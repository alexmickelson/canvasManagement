import { describe, it, expect } from "vitest";
import { LocalQuiz } from "../../models/localQuiz";
import { quizMarkdownUtils } from "../../models/utils/quizMarkdownUtils";
import { QuestionType } from "@/models/local/models/localQuizQuestion";
import { quizQuestionMarkdownUtils } from "@/models/local/models/utils/quizQuestionMarkdownUtils";
import { markdownToHtmlNoImages } from "@/services/htmlMarkdownUtils";

// Test suite for QuizMarkdown
describe("QuizMarkdownTests", () => {
  it("can serialize quiz to markdown", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: `
# quiz description

this is my description in markdown

\`here is code\`
`,
      lockAt: new Date(8640000000000000).toISOString(), // DateTime.MaxValue equivalent in TypeScript
      dueAt: new Date(8640000000000000).toISOString(),
      shuffleAnswers: true,
      oneQuestionAtATime: false,
      localAssignmentGroupName: "someId",
      allowedAttempts: -1,
      showCorrectAnswers: false,
      questions: [],
    };

    const markdown = quizMarkdownUtils.toMarkdown(quiz);

    expect(markdown).not.toContain("Name: Test Quiz");
    expect(markdown).toContain(quiz.description);
    expect(markdown).toContain("ShuffleAnswers: true");
    expect(markdown).toContain("OneQuestionAtATime: false");
    expect(markdown).toContain("AssignmentGroup: someId");
    expect(markdown).toContain("AllowedAttempts: -1");
  });

  it("can parse markdown quiz with no questions", () => {
    const name = "Test Quiz";
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
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);

    const expectedDescription = `
this is the
multi line
description`;

    expect(quiz.name).toBe("Test Quiz");
    expect(quiz.shuffleAnswers).toBe(true);
    expect(quiz.oneQuestionAtATime).toBe(false);
    expect(quiz.allowedAttempts).toBe(-1);
    expect(quiz.description.trim()).toBe(expectedDescription.trim());
  });

  it("can parse markdown quiz with password", () => {
    const password = "this-is-the-password";
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
Password: ${password}
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
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);

    expect(quiz.password).toBe(password);
  });

  it("can parse markdown quiz and configure to show correct answers", () => {
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
ShowCorrectAnswers: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the
multi line
description
---
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);

    expect(quiz.showCorrectAnswers).toBe(false);
  });

  it("can parse quiz with questions", () => {
    const name = "Test Quiz";
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
Points: 2
\`some type\` of question

with many

\`\`\`
lines
\`\`\`

*a) true
b) false

   endline`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.questionType).toBe(QuestionType.MULTIPLE_CHOICE);
    expect(firstQuestion.points).toBe(2);
    expect(firstQuestion.text).toContain("```");
    expect(firstQuestion.text).toContain("`some type` of question");
    expect(firstQuestion.answers[0].text).toBe("true");
    expect(firstQuestion.answers[0].correct).toBe(true);
    expect(firstQuestion.answers[1].correct).toBe(false);
    expect(firstQuestion.answers[1].text).toContain("endline");
  });

  it("can parse multiple questions", () => {
    const name = "Test Quiz";
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
[*] click
---
Points: 2
\`some type\` of question
*a) true
b) false
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.MULTIPLE_ANSWERS);

    const secondQuestion = quiz.questions[1];
    expect(secondQuestion.points).toBe(2);
    expect(secondQuestion.questionType).toBe(QuestionType.MULTIPLE_CHOICE);
  });

  it("short answer to markdown is correct", () => {
    const name = "Test Quiz";
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

  it("negative points is allowed", () => {
    const name = "Test Quiz";
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
Points: -4
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(firstQuestion.points).toBe(-4);
  });

  it("floating point points is allowed", () => {
    const name = "Test Quiz";
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
Points: 4.56
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(firstQuestion.points).toBe(4.56);
  });

  it("can parse quiz with latex in a question", () => {
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
Points: 2

This is latex: $x_2$

*a) true
b) false

   endline`;

    const quizHtml = markdownToHtmlNoImages(rawMarkdownQuiz);
    expect(quizHtml).not.toContain("$");
    expect(quizHtml).toContain("<mi>x</mi>");
    expect(quizHtml).not.toContain("x_2");
  });
});
