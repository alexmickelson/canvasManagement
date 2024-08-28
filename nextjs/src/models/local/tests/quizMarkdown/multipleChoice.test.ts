import { describe, it, expect } from "vitest";
import { LocalQuiz } from "../../quiz/localQuiz";
import { LocalQuizQuestion, QuestionType } from "../../quiz/localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../../quiz/localQuizQuestionAnswer";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { quizQuestionMarkdownUtils } from "@/models/local/quiz/utils/quizQuestionMarkdownUtils";

describe("MultipleChoiceTests", () => {
  it("quiz markdown includes multiple choice question", () => {
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
          points: 2,
          text: `
\`some type\` of question

with many 

\`\`\`
lines
\`\`\`
`,
          questionType: QuestionType.MULTIPLE_CHOICE,
          answers: [
            { correct: true, text: "true" },
            { correct: false, text: "false\n\nendline" },
          ],
          matchDistractors: [],
        },
      ],
    };

    const markdown = quizMarkdownUtils.toMarkdown(quiz);
    const expectedQuestionString = `
Points: 2

\`some type\` of question

with many 

\`\`\`
lines
\`\`\`

*a) true
b) false

endline`;
    expect(markdown).toContain(expectedQuestionString);
  });

  it("letter optional for multiple choice", () => {
    const questionMarkdown = `
Points: 2
\`some type\` of question
*) true
) false
`;

    const question = quizQuestionMarkdownUtils.parseMarkdown(
      questionMarkdown,
      0
    );
    expect(question.answers.length).toBe(2);
  });
});
