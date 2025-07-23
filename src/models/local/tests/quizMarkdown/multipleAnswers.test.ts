import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";
import { quizQuestionMarkdownUtils } from "@/features/local/quizzes/models/utils/quizQuestionMarkdownUtils";
import { describe, it, expect } from "vitest";

describe("MultipleAnswersTests", () => {
  it("quiz markdown includes multiple answer question", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "desc",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: false,
      showCorrectAnswers: false,
      localAssignmentGroupName: "someId",
      allowedAttempts: -1,
      questions: [
        {
          text: "oneline question",
          points: 1,
          questionType: QuestionType.MULTIPLE_ANSWERS,
          answers: [
            { correct: true, text: "true" },
            { correct: true, text: "false" },
            { correct: false, text: "neither" },
          ],
          matchDistractors: [],
        },
      ],
    };

    const markdown = quizMarkdownUtils.toMarkdown(quiz);
    const expectedQuestionString = `Points: 1
oneline question
[*] true
[*] false
[ ] neither`;
    expect(markdown).toContain(expectedQuestionString);
  });

  it("can parse question with multiple answers", () => {
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
[*] focus
[*] mousedown
[ ] submit
[ ] change
[ ] mouseout
[ ] keydown
---
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.MULTIPLE_ANSWERS);
    expect(firstQuestion.text).toContain(
      "Which events are triggered when the user clicks on an input field?"
    );
    expect(firstQuestion.answers[0].text).toBe("click");
    expect(firstQuestion.answers[0].correct).toBe(true);
    expect(firstQuestion.answers[3].correct).toBe(false);
    expect(firstQuestion.answers[3].text).toBe("submit");
  });

  it("can parse question with multiple answers without a space in false answers", () => {
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
[] submit
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.answers.length).toBe(2);
    expect(firstQuestion.answers[0].correct).toBe(true);
    expect(firstQuestion.answers[1].correct).toBe(false);
  });

  it("can parse question with multiple answers without a space in false answers other example", () => {
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
Points: 1
Which tool(s) will let you: create a database migration or reverse-engineer an existing database
[] swagger
[] a .http file
[*] dotnet ef command line interface
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.answers.length).toBe(3);
    expect(firstQuestion.answers[0].correct).toBe(false);
    expect(firstQuestion.answers[1].correct).toBe(false);
    expect(firstQuestion.answers[2].correct).toBe(true);
  });

  it("can use braces in answer for multiple answer", () => {
    const rawMarkdownQuestion = `
Which events are triggered when the user clicks on an input field?
[*] \`int[] theThing()\`
[ ] keydown
`;

    const question = quizQuestionMarkdownUtils.parseMarkdown(
      rawMarkdownQuestion,
      0
    );

    expect(question.answers[0].text).toBe("`int[] theThing()`");
    expect(question.answers.length).toBe(2);
  });

  it("can use braces in answer for multiple answer with multiline", () => {
    const rawMarkdownQuestion = `
Which events are triggered when the user clicks on an input field?
[*]
\`\`\`
int[] myNumbers = new int[] { };
DoSomething(ref myNumbers);
static void DoSomething(ref int[] numbers)
{
  // do something
}
\`\`\`
`;

    const question = quizQuestionMarkdownUtils.parseMarkdown(
      rawMarkdownQuestion,
      0
    );

    expect(question.answers[0].text).toBe(`\`\`\`
int[] myNumbers = new int[] { };
DoSomething(ref myNumbers);
static void DoSomething(ref int[] numbers)
{
  // do something
}
\`\`\``);
    expect(question.answers.length).toBe(1);
  });
});
