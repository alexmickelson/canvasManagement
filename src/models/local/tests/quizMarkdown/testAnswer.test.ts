import {
  getAnswers,
  getQuestionType,
} from "@/services/canvas/canvasQuizService";
import { QuestionType, zodQuestionType } from "../../models/localQuizQuestion";
import { quizMarkdownUtils } from "../../models/utils/quizMarkdownUtils";
import { quizQuestionMarkdownUtils } from "../../models/utils/quizQuestionMarkdownUtils";
import { describe, it, expect } from "vitest";

describe("TextAnswerTests", () => {
  it("can parse essay", () => {
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
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.ESSAY);
    expect(firstQuestion.text).not.toContain("essay");
  });

  it("can parse short answer", () => {
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

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.SHORT_ANSWER);
    expect(firstQuestion.text).not.toContain("short answer");
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

  it("short_answer= to markdown is correct", () => {
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
*a) yes
*b) Yes
short_answer=
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];

    const questionMarkdown =
      quizQuestionMarkdownUtils.toMarkdown(firstQuestion);
    const expectedMarkdown = `Points: 1
Which events are triggered when the user clicks on an input field?
*a) yes
*b) Yes
short_answer=`;
    expect(questionMarkdown).toContain(expectedMarkdown);
  });

  it("essay question to markdown is correct", () => {
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

  it("Can parse short answer with auto graded answers", () => {
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
*a) test
*b) other
short_answer=
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(firstQuestion.questionType).toBe(
      QuestionType.SHORT_ANSWER_WITH_ANSWERS
    );
    expect(firstQuestion.answers.length).toBe(2);
    expect(firstQuestion.answers[0].text).toBe("test");
    expect(firstQuestion.answers[1].text).toBe("other");
  });

  it("Can parse short answer with auto graded answers", () => {
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
*a) test
*b) other
short_answer=
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(firstQuestion.questionType).toBe(
      QuestionType.SHORT_ANSWER_WITH_ANSWERS
    );
    expect(firstQuestion.answers.length).toBe(2);
    expect(firstQuestion.answers[0].text).toBe("test");
    expect(firstQuestion.answers[1].text).toBe("other");
  });

  it("Has short_answer= type at the same position in types and zod types", () => {
    expect(Object.values(zodQuestionType.Enum)).toEqual(
      Object.values(QuestionType)
    );
  });

  it("Associates short_answer= questions with short_answer_question canvas question type", () => {
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
*a) test
*b) other
short_answer=
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    expect(getQuestionType(firstQuestion)).toBe("short_answer_question");
  });

  it("Includes answer_text in answers sent to canvas", () => {
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
*a) test
*b) other
short_answer=
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz, name);
    const firstQuestion = quiz.questions[0];
    const answers = getAnswers(firstQuestion, {
      name: "",
      assignmentGroups: [],
      daysOfWeek: [],
      canvasId: 0,
      startDate: "",
      endDate: "",
      defaultDueTime: {
        hour: 0,
        minute: 0,
      },
      defaultAssignmentSubmissionTypes: [],
      defaultFileUploadTypes: [],
      holidays: [],
      assets: [],
    });
    expect(answers).toHaveLength(2);
    const firstAnswer = answers[0];
    expect(firstAnswer).toHaveProperty("answer_text");
  });
});
