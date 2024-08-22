import { QuestionType } from '../../../../../models/local/quiz/localQuizQuestion';
import { quizMarkdownUtils } from '../../../../../models/local/quiz/utils/quizMarkdownUtils';
import { quizQuestionMarkdownUtils } from '../../../../../models/local/quiz/utils/quizQuestionMarkdownUtils';
import { describe, it, expect } from 'vitest';

describe('TextAnswerTests', () => {
  it('can parse essay', () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.ESSAY);
    expect(firstQuestion.text).not.toContain('essay');
  });

  it('can parse short answer', () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const firstQuestion = quiz.questions[0];

    expect(firstQuestion.points).toBe(1);
    expect(firstQuestion.questionType).toBe(QuestionType.SHORT_ANSWER);
    expect(firstQuestion.text).not.toContain('short answer');
  });

  it('short answer to markdown is correct', () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
short answer
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const firstQuestion = quiz.questions[0];

    const questionMarkdown = quizQuestionMarkdownUtils.toMarkdown(firstQuestion);
    const expectedMarkdown = `Points: 1
Which events are triggered when the user clicks on an input field?
short_answer`;
    expect(questionMarkdown).toContain(expectedMarkdown);
  });

  it('essay question to markdown is correct', () => {
    const rawMarkdownQuiz = `
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 21/08/2023 23:59:00
LockAt: 21/08/2023 23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the 
multi line
description
---
Which events are triggered when the user clicks on an input field?
essay
`;

    const quiz = quizMarkdownUtils.parseMarkdown(rawMarkdownQuiz);
    const firstQuestion = quiz.questions[0];

    const questionMarkdown = quizQuestionMarkdownUtils.toMarkdown(firstQuestion);
    const expectedMarkdown = `Points: 1
Which events are triggered when the user clicks on an input field?
essay`;
    expect(questionMarkdown).toContain(expectedMarkdown);
  });
});
