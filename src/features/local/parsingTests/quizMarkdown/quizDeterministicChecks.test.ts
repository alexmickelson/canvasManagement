import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";
import { describe, it, expect } from "vitest";

// Test suite for deterministic checks on LocalQuiz
describe("QuizDeterministicChecks", () => {
  it("SerializationIsDeterministic_EmptyQuiz", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_ShowCorrectAnswers", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      showCorrectAnswers: false,
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [],
      allowedAttempts: -1,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_ShortAnswer", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [
        {
          text: "test short answer",
          questionType: QuestionType.SHORT_ANSWER,
          points: 1,
          answers: [],
          matchDistractors: [],
        },
      ],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_Essay", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [
        {
          text: "test essay",
          questionType: QuestionType.ESSAY,
          points: 1,
          matchDistractors: [],
          answers: [],
        },
      ],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_MultipleAnswer", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [
        {
          text: "test multiple answer",
          questionType: QuestionType.MULTIPLE_ANSWERS,
          points: 1,
          matchDistractors: [],
          answers: [
            { text: "yes", correct: true },
            { text: "no", correct: true },
          ],
        },
      ],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_MultipleChoice", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      password: undefined,
      localAssignmentGroupName: "Assignments",
      questions: [
        {
          text: "test multiple choice",
          questionType: QuestionType.MULTIPLE_CHOICE,
          points: 1,
          matchDistractors: [],
          answers: [
            { text: "yes", correct: true },
            { text: "no", correct: false },
          ],
        },
      ],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_Matching", () => {
    const name = "Test Quiz";
    const quiz: LocalQuiz = {
      name,
      description: "quiz description",
      lockAt: "08/21/2023 23:59:00",
      dueAt: "08/21/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      password: undefined,
      localAssignmentGroupName: "Assignments",
      questions: [
        {
          text: "test matching",
          questionType: QuestionType.MATCHING,
          points: 1,
          matchDistractors: [],
          answers: [
            { text: "yes", correct: true, matchedText: "testing yes" },
            { text: "no", correct: true, matchedText: "testing no" },
          ],
        },
      ],
      allowedAttempts: -1,
      showCorrectAnswers: true,
      
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown, name);

    expect(parsedQuiz).toEqual(quiz);
  });
});
