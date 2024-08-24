import { describe, it, expect } from "vitest";
import { LocalQuiz } from "../../quiz/localQuiz";
import { quizMarkdownUtils } from "../../quiz/utils/quizMarkdownUtils";
import { QuestionType } from "@/models/local/quiz/localQuizQuestion";

// Test suite for deterministic checks on LocalQuiz
describe("QuizDeterministicChecks", () => {
  it("SerializationIsDeterministic_EmptyQuiz", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [],
      allowedAttempts: -1,
      showCorrectAnswers: true,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_ShowCorrectAnswers", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
      showCorrectAnswers: false,
      shuffleAnswers: true,
      oneQuestionAtATime: true,
      localAssignmentGroupName: "Assignments",
      questions: [],
      allowedAttempts: -1,
    };

    const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_ShortAnswer", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
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
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_Essay", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
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
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_MultipleAnswer", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
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
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_MultipleChoice", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
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
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });

  it("SerializationIsDeterministic_Matching", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: "quiz description",
      lockAt: "21/08/2023 23:59:00",
      dueAt: "21/08/2023 23:59:00",
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
    const parsedQuiz = quizMarkdownUtils.parseMarkdown(quizMarkdown);

    expect(parsedQuiz).toEqual(quiz);
  });
});
