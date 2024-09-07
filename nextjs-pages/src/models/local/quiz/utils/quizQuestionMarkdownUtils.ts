import { LocalQuiz } from "../localQuiz";
import { LocalQuizQuestion, QuestionType } from "../localQuizQuestion";
import { LocalQuizQuestionAnswer } from "../localQuizQuestionAnswer";
import { quizQuestionAnswerMarkdownUtils } from "./quizQuestionAnswerMarkdownUtils";

const _validFirstAnswerDelimiters = ["*a)", "a)", "*)", ")", "[ ]", "[*]", "^"];

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
const getQuestionType = (
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

  const answerLines = getAnswerStringsWithMultilineSupport(
    linesWithoutPoints,
    questionIndex
  );
  const firstAnswerLine = answerLines[0];
  const isMultipleChoice = ["a)", "*a)", "*)", ")"].some((prefix) =>
    firstAnswerLine.startsWith(prefix)
  );

  if (isMultipleChoice) return QuestionType.MULTIPLE_CHOICE;

  const isMultipleAnswer = ["[ ]", "[*]"].some((prefix) =>
    firstAnswerLine.startsWith(prefix)
  );
  if (isMultipleAnswer) return QuestionType.MULTIPLE_ANSWERS;

  const isMatching = firstAnswerLine.startsWith("^");
  if (isMatching) return QuestionType.MATCHING;

  return QuestionType.NONE;
};

const getAnswers = (
  linesWithoutPoints: string[],
  questionIndex: number,
  questionType: string
): LocalQuizQuestionAnswer[] => {
  const answerLines = getAnswerStringsWithMultilineSupport(
    linesWithoutPoints,
    questionIndex
  );

  const answers = answerLines.map((a, i) =>
    quizQuestionAnswerMarkdownUtils.parseMarkdown(a, questionType)
  );
  return answers;
};
const getAnswerMarkdown = (
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

export const quizQuestionMarkdownUtils = {
  toMarkdown(question: LocalQuizQuestion): string {
    const answerArray = question.answers.map((a, i) =>
      getAnswerMarkdown(question, a, i)
    );

    const distractorText =
      question.questionType === QuestionType.MATCHING
        ? question.matchDistractors?.map((d) => `\n^ - ${d}`).join("") ?? ""
        : "";

    const answersText = answerArray.join("\n");
    const questionTypeIndicator =
      question.questionType === "essay" ||
      question.questionType === "short_answer"
        ? question.questionType
        : "";

    return `Points: ${question.points}\n${question.text}\n${answersText}${distractorText}${questionTypeIndicator}`;
  },

  parseMarkdown(input: string, questionIndex: number): LocalQuizQuestion {
    const lines = input.trim().split("\n");
    const firstLineIsPoints = lines[0].toLowerCase().includes("points: ");

    const textHasPoints =
      lines.length > 0 &&
      lines[0].includes(": ") &&
      lines[0].split(": ").length > 1 &&
      !isNaN(parseFloat(lines[0].split(": ")[1]));

    const points =
      firstLineIsPoints && textHasPoints
        ? parseFloat(lines[0].split(": ")[1])
        : 1;

    const linesWithoutPoints = firstLineIsPoints ? lines.slice(1) : lines;

    const { linesWithoutAnswers } = linesWithoutPoints.reduce(
      ({ linesWithoutAnswers, taking }, currentLine) => {
        if (!taking)
          return { linesWithoutAnswers: linesWithoutAnswers, taking: false };

        const lineIsAnswer = _validFirstAnswerDelimiters.some((prefix) =>
          currentLine.trimStart().startsWith(prefix)
        );
        if (lineIsAnswer)
          return { linesWithoutAnswers: linesWithoutAnswers, taking: false };

        return {
          linesWithoutAnswers: [...linesWithoutAnswers, currentLine],
          taking: true,
        };
      },
      { linesWithoutAnswers: [] as string[], taking: true }
    );
    const questionType = getQuestionType(linesWithoutPoints, questionIndex);

    const questionTypesWithoutAnswers = [
      "essay",
      "short answer",
      "short_answer",
    ];

    const descriptionLines = questionTypesWithoutAnswers.includes(
      questionType.toLowerCase()
    )
      ? linesWithoutAnswers
          .slice(0, linesWithoutPoints.length)
          .filter(
            (line, index) =>
              !questionTypesWithoutAnswers.includes(line.toLowerCase())
          )
      : linesWithoutAnswers;

    const description = descriptionLines.join("\n");

    const typesWithAnswers = [
      "multiple_choice",
      "multiple_answers",
      "matching",
    ];
    const answers = typesWithAnswers.includes(questionType)
      ? getAnswers(linesWithoutPoints, questionIndex, questionType)
      : [];

    const answersWithoutDistractors =
      questionType === QuestionType.MATCHING
        ? answers.filter((a) => a.text)
        : answers;

    const distractors =
      questionType === QuestionType.MATCHING
        ? answers.filter((a) => !a.text).map((a) => a.matchedText ?? "")
        : [];

    const question: LocalQuizQuestion = {
      text: description,
      questionType,
      points,
      answers: answersWithoutDistractors,
      matchDistractors: distractors,
    };
    return question;
  },
};
