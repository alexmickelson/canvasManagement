import { LocalQuizQuestion, QuestionType } from "../localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../localQuizQuestionAnswer";
const _validFirstAnswerDelimiters = [
  "*a)",
  "a)",
  "*)",
  ")",
  "[ ]",
  "[]",
  "[*]",
  "^",
  "=",
];
const _multipleChoicePrefix = ["a)", "*a)", "*)", ")"];
const _multipleAnswerPrefix = ["[ ]", "[*]", "[]"];

const parseNumericalAnswer = (input: string): LocalQuizQuestionAnswer => {
  const numericValue = parseFloat(input.replace(/^=\s*/, "").trim());
  const answer: LocalQuizQuestionAnswer = {
    correct: true,
    text: input.trim(),
    numericalAnswerType: "exact_answer",
    numericAnswer: numericValue,
  };
  return answer;
};

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

const getAnswerStringsWithMultilineSupport = (
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

export const quizQuestionAnswerMarkdownUtils = {
  parseMarkdown(
    input: string,
    questionType: QuestionType
  ): LocalQuizQuestionAnswer {
    if (questionType === QuestionType.NUMERICAL) {
      return parseNumericalAnswer(input);
    }

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
  isAnswerLine: (trimmedLine: string): boolean => {
    return _validFirstAnswerDelimiters.some((prefix) =>
      trimmedLine.startsWith(prefix)
    );
  },
  getQuestionType: (
    linesWithoutPoints: string[],
    questionIndex: number // needed for debug logging
  ): QuestionType => {
    const lastLine = linesWithoutPoints[linesWithoutPoints.length - 1]
      .toLowerCase()
      .trim();
    if (linesWithoutPoints.length === 0) return QuestionType.NONE;
    if (lastLine === "essay") return QuestionType.ESSAY;
    if (lastLine === "short answer") return QuestionType.SHORT_ANSWER;
    if (lastLine === "short_answer") return QuestionType.SHORT_ANSWER;
    if (lastLine === "short_answer=")
      return QuestionType.SHORT_ANSWER_WITH_ANSWERS;
    if (lastLine.startsWith("=")) return QuestionType.NUMERICAL;

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
  },
  getAnswers: (
    linesWithoutPoints: string[],
    questionIndex: number,
    questionType: QuestionType
  ): { answers: LocalQuizQuestionAnswer[]; distractors: string[] } => {
    const typesWithAnswers: QuestionType[] = [
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.MULTIPLE_ANSWERS,
      QuestionType.MATCHING,
      QuestionType.SHORT_ANSWER_WITH_ANSWERS,
      QuestionType.NUMERICAL,
    ];
    if (!typesWithAnswers.includes(questionType)) {
      return { answers: [], distractors: [] };
    }

    if (questionType == QuestionType.SHORT_ANSWER_WITH_ANSWERS)
      linesWithoutPoints = linesWithoutPoints.slice(
        0,
        linesWithoutPoints.length - 1
      );

    const answerLines = getAnswerStringsWithMultilineSupport(
      linesWithoutPoints,
      questionIndex
    );

    const allAnswers = answerLines.map((a) =>
      quizQuestionAnswerMarkdownUtils.parseMarkdown(a, questionType)
    );

    // For matching questions, separate answers from distractors
    if (questionType === QuestionType.MATCHING) {
      const answers = allAnswers.filter((a) => a.text);
      const distractors = allAnswers
        .filter((a) => !a.text)
        .map((a) => a.matchedText ?? "");
      return { answers, distractors };
    }

    return { answers: allAnswers, distractors: [] };
  },

  getAnswerMarkdown: (
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
  },
};
