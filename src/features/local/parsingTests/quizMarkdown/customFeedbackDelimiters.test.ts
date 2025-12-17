import { describe, it, expect } from "vitest";
import { quizQuestionMarkdownUtils } from "../../quizzes/models/utils/quizQuestionMarkdownUtils";
import { FeedbackDelimiters } from "../../quizzes/models/utils/quizFeedbackMarkdownUtils";
import { QuestionType } from "../../quizzes/models/localQuizQuestion";

describe("Custom Feedback Delimiters", () => {
  const customDelimiters: FeedbackDelimiters = {
    correct: ":)",
    incorrect: ":(",
    neutral: ":|",
  };

  it("can parse question with custom feedback delimiters", () => {
    const input = `Points: 1
Question text
:) Correct feedback
:( Incorrect feedback
:| Neutral feedback
*a) Answer 1
b) Answer 2`;

    const question = quizQuestionMarkdownUtils.parseMarkdown(input, 0, customDelimiters);

    expect(question.correctComments).toBe("Correct feedback");
    expect(question.incorrectComments).toBe("Incorrect feedback");
    expect(question.neutralComments).toBe("Neutral feedback");
  });

  it("can serialize question with custom feedback delimiters", () => {
    const question = {
      points: 1,
      text: "Question text",
      questionType: "multiple_choice_question" as QuestionType,
      answers: [
        { text: "Answer 1", correct: true, weight: 100 },
        { text: "Answer 2", correct: false, weight: 0 },
      ],
      correctComments: "Correct feedback",
      incorrectComments: "Incorrect feedback",
      neutralComments: "Neutral feedback",
      matchDistractors: [],
    };

    const markdown = quizQuestionMarkdownUtils.toMarkdown(question, customDelimiters);

    expect(markdown).toContain(":) Correct feedback");
    expect(markdown).toContain(":( Incorrect feedback");
    expect(markdown).toContain(":| Neutral feedback");
  });
});
