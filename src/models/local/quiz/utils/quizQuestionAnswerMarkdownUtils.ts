import { QuestionType } from "../localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../localQuizQuestionAnswer";

export const quizQuestionAnswerMarkdownUtils = {
  // getHtmlText(): string {
  //   return MarkdownService.render(this.text);
  // }

  parseMarkdown(input: string, questionType: string): LocalQuizQuestionAnswer {
    const isCorrect = input.startsWith("*") || input[1] === "*";

    if (questionType === QuestionType.MATCHING) {
      const matchingPattern = /^\^ ?/;
      const textWithoutMatchDelimiter = input
        .replace(matchingPattern, "")
        .trim();
      const [text, ...matchedParts] = textWithoutMatchDelimiter.split("-");
      const answer: LocalQuizQuestionAnswer = {
        correct: true,
        text: text.trim(),
        matchedText: matchedParts.join("-").trim(),
      };
      return answer;
    }

    const startingQuestionPattern = /^(\*?[a-z]?\))|\[\s*\]|\[\*\]|\^ /;

    let replaceCount = 0;
    const text = input
      .replace(startingQuestionPattern, (m) => (replaceCount++ === 0 ? "" : m))
      .trim();

    const answer: LocalQuizQuestionAnswer = {
      correct: isCorrect,
      text: text,
    };
    return answer;
  },
};
