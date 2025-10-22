import { describe, it, expect } from "vitest";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";
import { LocalQuiz } from "../../quizzes/models/localQuiz";

describe("Question Feedback options", () => {
  it("can parse question with correct feedback", () => {
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
Points: 3
What is the purpose of a context switch?
+ Correct! The context switch is used to change the current process by swapping the registers and other state with a new process
*a) To change the current window you are on
b) To change the current process's status
*c) To swap the current process's registers for a new process's registers
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.correctComments).toBe(
      "Correct! The context switch is used to change the current process by swapping the registers and other state with a new process"
    );
    expect(question.incorrectComments).toBeUndefined();
    expect(question.neutralComments).toBeUndefined();
  });

  it("can parse question with incorrect feedback", () => {
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
Points: 3
What state does a process need to be in to be able to be scheduled?
- Incorrect! A process in ready state can be scheduled
*a) Ready
b) Running
c) Zombie
d) Embryo
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.incorrectComments).toBe(
      "Incorrect! A process in ready state can be scheduled"
    );
    expect(question.correctComments).toBeUndefined();
    expect(question.neutralComments).toBeUndefined();
  });

  it("can parse question with correct and incorrect feedback", () => {
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
Points: 3
What is the purpose of a context switch?
+ Correct! The context switch is used to change the current process
- Incorrect! The context switch is NOT used to change windows
*a) To change the current window you are on
b) To change the current process's status
*c) To swap the current process's registers for a new process's registers
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.correctComments).toBe(
      "Correct! The context switch is used to change the current process"
    );
    expect(question.incorrectComments).toBe(
      "Incorrect! The context switch is NOT used to change windows"
    );
    expect(question.neutralComments).toBeUndefined();
  });

  it("can parse question with neutral feedback", () => {
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
Points: 3
What is a prime number?
... This feedback will be shown regardless of the answer
*a) A number divisible only by 1 and itself
b) Any odd number
c) Any even number
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.neutralComments).toBe(
      "This feedback will be shown regardless of the answer"
    );
    expect(question.correctComments).toBeUndefined();
    expect(question.incorrectComments).toBeUndefined();
  });

  it("can parse question with all three feedback types", () => {
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
Points: 3
What is the purpose of a context switch?
+ Great job! You understand context switching
- Try reviewing the material on process management
... Context switches are a fundamental operating system concept
*a) To change the current window you are on
b) To change the current process's status
*c) To swap the current process's registers for a new process's registers
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.correctComments).toBe(
      "Great job! You understand context switching"
    );
    expect(question.incorrectComments).toBe(
      "Try reviewing the material on process management"
    );
    expect(question.neutralComments).toBe(
      "Context switches are a fundamental operating system concept"
    );
  });

  it("can parse multiline feedback", () => {
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
Points: 3
What is the purpose of a context switch?
+ Correct! The context switch is used to change the current process.
This is additional information on a new line.
- Incorrect! You should review the material.
Check your notes on process management.
*a) To change the current window you are on
b) To change the current process's status
*c) To swap the current process's registers for a new process's registers
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.correctComments).toBe(
      "Correct! The context switch is used to change the current process.\nThis is additional information on a new line."
    );
    expect(question.incorrectComments).toBe(
      "Incorrect! You should review the material.\nCheck your notes on process management."
    );
  });

  it("feedback can serialize to markdown", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: new Date(8640000000000000).toISOString(),
      dueAt: new Date(8640000000000000).toISOString(),
      shuffleAnswers: true,
      oneQuestionAtATime: false,
      localAssignmentGroupName: "Assignments",
      allowedAttempts: -1,
      showCorrectAnswers: false,
      questions: [
        {
          text: "What is the purpose of a context switch?",
          questionType: QuestionType.MULTIPLE_CHOICE,
          points: 3,
          correctComments: "Correct! Good job",
          incorrectComments: "Incorrect! Try again",
          neutralComments: "Context switches are important",
          answers: [
            { correct: false, text: "To change the current window you are on" },
            { correct: true, text: "To swap registers" },
          ],
          matchDistractors: [],
        },
      ],
    };

    const markdown = quizMarkdownUtils.toMarkdown(quiz);

    expect(markdown).toContain("+ Correct! Good job");
    expect(markdown).toContain("- Incorrect! Try again");
    expect(markdown).toContain("... Context switches are important");
  });

  it("can parse question with alternative format using ellipsis for general feedback", () => {
    const name = "Test Quiz";
    const rawMarkdownQuiz = `
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 08/21/2023 23:59:00
LockAt: 08/21/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: An addition question
---
Points: 2
What is 2+3?
... General question feedback.
+ Feedback for correct answer.
- Feedback for incorrect answer.
a) 6
b) 1
*c) 5
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.text).toBe("What is 2+3?");
    expect(question.points).toBe(2);
    expect(question.neutralComments).toBe("General question feedback.");
    expect(question.correctComments).toBe("Feedback for correct answer.");
    expect(question.incorrectComments).toBe("Feedback for incorrect answer.");
    expect(question.answers).toHaveLength(3);
    expect(question.answers[0].text).toBe("6");
    expect(question.answers[0].correct).toBe(false);
    expect(question.answers[1].text).toBe("1");
    expect(question.answers[1].correct).toBe(false);
    expect(question.answers[2].text).toBe("5");
    expect(question.answers[2].correct).toBe(true);
  });

  it("can parse multiline general feedback with ellipsis", () => {
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
Points: 2
What is 2+3?
...
General question feedback.
This continues on multiple lines.
+ Feedback for correct answer.
- Feedback for incorrect answer.
a) 6
b) 1
*c) 5
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const question = quiz.questions[0];

    expect(question.neutralComments).toBe(
      "General question feedback.\nThis continues on multiple lines."
    );
    expect(question.correctComments).toBe("Feedback for correct answer.");
    expect(question.incorrectComments).toBe("Feedback for incorrect answer.");
  });
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
    expect(firstQuestion.neutralComments).not.toContain("...");
  });
});
