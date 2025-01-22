import { QuestionType } from "../localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../localQuizQuestionAnswer";

const parseMatchingAnswer = (input: string) => {
  const matchingPattern = /^\^?/;
  const textWithoutMatchDelimiter = input.replace(matchingPattern, "");
  const [text, ...matchedParts] = textWithoutMatchDelimiter.split(" - ");
  const answer: LocalQuizQuestionAnswer = {
    correct: true,
    text: text.trim(),
    matchedText: matchedParts.join("-").trim(),
  };
  return answer;
};

export const quizQuestionAnswerMarkdownUtils = {
  // getHtmlText(): string {
  //   return MarkdownService.render(this.text);
  // }

  parseMarkdown(input: string, questionType: string): LocalQuizQuestionAnswer {
    const isCorrect = input.startsWith("*") || input[1] === "*";

    if (questionType === QuestionType.MATCHING) {
      return parseMatchingAnswer(input);
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
