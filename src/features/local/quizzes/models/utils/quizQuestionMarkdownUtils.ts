import { LocalQuizQuestion, QuestionType } from "../localQuizQuestion";
import { quizFeedbackMarkdownUtils } from "./quizFeedbackMarkdownUtils";
import { quizQuestionAnswerMarkdownUtils } from "./quizQuestionAnswerMarkdownUtils";

const splitLinesAndPoints = (input: string[]) => {
  const firstLineIsPoints = input[0].toLowerCase().includes("points: ");

  const textHasPointsLine =
    input.length > 0 &&
    input[0].includes(": ") &&
    input[0].split(": ").length > 1 &&
    !isNaN(parseFloat(input[0].split(": ")[1]));

  const points =
    firstLineIsPoints && textHasPointsLine
      ? parseFloat(input[0].split(": ")[1])
      : 1;

  const linesWithoutPoints = firstLineIsPoints ? input.slice(1) : input;

  return { points, lines: linesWithoutPoints };
};

const getLinesBeforeAnswerLines = (lines: string[]): string[] => {
  const { linesWithoutAnswers } = lines.reduce(
    ({ linesWithoutAnswers, taking }, currentLine) => {
      if (!taking)
        return { linesWithoutAnswers: linesWithoutAnswers, taking: false };

      const lineIsAnswer =
        quizQuestionAnswerMarkdownUtils.isAnswerLine(currentLine);
      if (lineIsAnswer)
        return { linesWithoutAnswers: linesWithoutAnswers, taking: false };

      return {
        linesWithoutAnswers: [...linesWithoutAnswers, currentLine],
        taking: true,
      };
    },
    { linesWithoutAnswers: [] as string[], taking: true }
  );
  return linesWithoutAnswers;
};

const removeQuestionTypeFromDescriptionLines = (
  linesWithoutAnswers: string[],
  questionType: QuestionType
): string[] => {
  const questionTypesWithoutAnswers = ["essay", "short answer", "short_answer"];

  const descriptionLines = questionTypesWithoutAnswers.includes(questionType)
    ? linesWithoutAnswers.filter(
        (line) => !questionTypesWithoutAnswers.includes(line.toLowerCase())
      )
    : linesWithoutAnswers;

  return descriptionLines;
};

export const quizQuestionMarkdownUtils = {
  toMarkdown(question: LocalQuizQuestion): string {
    const answerArray = question.answers.map((a, i) =>
      quizQuestionAnswerMarkdownUtils.getAnswerMarkdown(question, a, i)
    );

    const distractorText =
      question.questionType === QuestionType.MATCHING
        ? question.matchDistractors?.map((d) => `\n^ - ${d}`).join("") ?? ""
        : "";

    // Build feedback lines
    const feedbackText = quizFeedbackMarkdownUtils.formatFeedback(
      question.correctComments,
      question.incorrectComments,
      question.neutralComments
    );

    const answersText = answerArray.join("\n");
    const questionTypeIndicator =
      question.questionType === "essay" ||
      question.questionType === "short_answer"
        ? question.questionType
        : question.questionType === QuestionType.SHORT_ANSWER_WITH_ANSWERS
        ? `\n${QuestionType.SHORT_ANSWER_WITH_ANSWERS}`
        : "";

    return `Points: ${question.points}\n${question.text}\n${feedbackText}${answersText}${distractorText}${questionTypeIndicator}`;
  },

  parseMarkdown(input: string, questionIndex: number): LocalQuizQuestion {
    const { points, lines } = splitLinesAndPoints(input.trim().split("\n"));

    const linesWithoutAnswers = getLinesBeforeAnswerLines(lines);

    const questionType = quizQuestionAnswerMarkdownUtils.getQuestionType(
      lines,
      questionIndex
    );

    const linesWithoutAnswersAndTypes = removeQuestionTypeFromDescriptionLines(
      linesWithoutAnswers,
      questionType
    );

    const {
      correctComments,
      incorrectComments,
      neutralComments,
      otherLines: descriptionLines,
    } = quizFeedbackMarkdownUtils.extractFeedback(linesWithoutAnswersAndTypes);

    const { answers, distractors } = quizQuestionAnswerMarkdownUtils.getAnswers(
      lines,
      questionIndex,
      questionType
    );

    const question: LocalQuizQuestion = {
      text: descriptionLines.join("\n"),
      questionType,
      points,
      answers,
      matchDistractors: distractors,
      correctComments,
      incorrectComments,
      neutralComments,
    };
    return question;
  },
};
