import { QuestionType, LocalQuizQuestion } from "../localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../localQuizQuestionAnswer";
import { quizQuestionAnswerMarkdownUtils } from "./quizQuestionAnswerMarkdownUtils";

const _validFirstAnswerDelimiters = [
  "*a)",
  "a)",
  "*)",
  ")",
  "[ ]",
  "[]",
  "[*]",
  "^",
];
const _multipleChoicePrefix = ["a)", "*a)", "*)", ")"];
const _multipleAnswerPrefix = ["[ ]", "[*]", "[]"];

export const isAnswerLine = (trimmedLine: string): boolean => {
  return _validFirstAnswerDelimiters.some((prefix) =>
    trimmedLine.startsWith(prefix)
  );
};

export const getAnswerStringsWithMultilineSupport = (
  linesWithoutPoints: string[],
  questionIndex: number
) => {
  const indexOfAnswerStart = linesWithoutPoints.findIndex((l) =>
    _validFirstAnswerDelimiters.some((prefix) =>
      l.trimStart().startsWith(prefix)
    )
  );
  if (indexOfAnswerStart === -1) {
    const debugLine = linesWithoutPoints.find((l) => l.trim().length > 0);
    throw Error(
      `question ${
        questionIndex + 1
      }: no answers when detecting question type on ${debugLine}`
    );
  }

  const answerLinesRaw = linesWithoutPoints.slice(indexOfAnswerStart);

  const answerStartPattern = /^(\*?[a-z]?\))|(?<!\S)\[\s*\]|\[\*\]|\^/;
  const answerLines = answerLinesRaw.reduce((acc: string[], line: string) => {
    const isNewAnswer = answerStartPattern.test(line);
    if (isNewAnswer) {
      acc.push(line);
    } else if (acc.length !== 0) {
      acc[acc.length - 1] += "\n" + line;
    } else {
      acc.push(line);
    }
    return acc;
  }, []);
  return answerLines;
};

export const getQuestionType = (
  linesWithoutPoints: string[],
  questionIndex: number
): QuestionType => {
  if (linesWithoutPoints.length === 0) return QuestionType.NONE;
  if (
    linesWithoutPoints[linesWithoutPoints.length - 1].toLowerCase() === "essay"
  )
    return QuestionType.ESSAY;
  if (
    linesWithoutPoints[linesWithoutPoints.length - 1].toLowerCase() ===
    "short answer"
  )
    return QuestionType.SHORT_ANSWER;
  if (
    linesWithoutPoints[linesWithoutPoints.length - 1].toLowerCase() ===
    "short_answer"
  )
    return QuestionType.SHORT_ANSWER;
  if (
    linesWithoutPoints[linesWithoutPoints.length - 1].toLowerCase().trim() ===
    "short_answer="
  )
    return QuestionType.SHORT_ANSWER_WITH_ANSWERS;

  const answerLines = getAnswerStringsWithMultilineSupport(
    linesWithoutPoints,
    questionIndex
  );
  const firstAnswerLine = answerLines[0];
  const isMultipleChoice = _multipleChoicePrefix.some((prefix) =>
    firstAnswerLine.startsWith(prefix)
  );

  if (isMultipleChoice) return QuestionType.MULTIPLE_CHOICE;

  const isMultipleAnswer = _multipleAnswerPrefix.some((prefix) =>
    firstAnswerLine.startsWith(prefix)
  );
  if (isMultipleAnswer) return QuestionType.MULTIPLE_ANSWERS;

  const isMatching = firstAnswerLine.startsWith("^");
  if (isMatching) return QuestionType.MATCHING;

  return QuestionType.NONE;
};

export const getAnswers = (
  linesWithoutPoints: string[],
  questionIndex: number,
  questionType: string
): LocalQuizQuestionAnswer[] => {
  if (questionType == QuestionType.SHORT_ANSWER_WITH_ANSWERS)
    linesWithoutPoints = linesWithoutPoints.slice(
      0,
      linesWithoutPoints.length - 1
    );
  const answerLines = getAnswerStringsWithMultilineSupport(
    linesWithoutPoints,
    questionIndex
  );

  const answers = answerLines.map((a) =>
    quizQuestionAnswerMarkdownUtils.parseMarkdown(a, questionType)
  );
  return answers;
};

export const getAnswerMarkdown = (
  question: LocalQuizQuestion,
  answer: LocalQuizQuestionAnswer,
  index: number
): string => {
  const multilineMarkdownCompatibleText = answer.text.startsWith("```")
    ? "\n" + answer.text
    : answer.text;

  if (question.questionType === "multiple_answers") {
    const correctIndicator = answer.correct ? "*" : " ";
    const questionTypeIndicator = `[${correctIndicator}] `;

    return `${questionTypeIndicator}${multilineMarkdownCompatibleText}`;
  } else if (question.questionType === "matching") {
    return `^ ${answer.text} - ${answer.matchedText}`;
  } else {
    const questionLetter = String.fromCharCode(97 + index);
    const correctIndicator = answer.correct ? "*" : "";
    const questionTypeIndicator = `${correctIndicator}${questionLetter}) `;

    return `${questionTypeIndicator}${multilineMarkdownCompatibleText}`;
  }
};
