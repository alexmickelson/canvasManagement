import { LocalQuizQuestion, QuestionType } from "../localQuizQuestion";
import { quizFeedbackMarkdownUtils } from "./quizFeedbackMarkdownUtils";
import {
  getAnswerMarkdown,
  getAnswers,
  getQuestionType,
  isAnswerLine,
} from "./quizQuestionAnswerParsingUtils";

export const quizQuestionMarkdownUtils = {
  toMarkdown(question: LocalQuizQuestion): string {
    const answerArray = question.answers.map((a, i) =>
      getAnswerMarkdown(question, a, i)
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
    const lines = input
      .trim()
      .split("\n");
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

        const lineIsAnswer = isAnswerLine(currentLine);
        if (lineIsAnswer)
          return { linesWithoutAnswers: linesWithoutAnswers, taking: false };

        return {
          linesWithoutAnswers: [...linesWithoutAnswers, currentLine],
          taking: true,
        };
      },
      { linesWithoutAnswers: [] as string[], taking: true }
    );

    const questionType = getQuestionType(lines, questionIndex);

    const questionTypesWithoutAnswers = [
      "essay",
      "short answer",
      "short_answer",
    ];

    const descriptionLines = questionTypesWithoutAnswers.includes(questionType)
      ? linesWithoutAnswers
          .slice(0, linesWithoutPoints.length)
          .filter(
            (line) => !questionTypesWithoutAnswers.includes(line.toLowerCase())
          )
      : linesWithoutAnswers;

    const {
      correctComments,
      incorrectComments,
      neutralComments,
      otherLines: descriptionWithoutFeedback,
    } = quizFeedbackMarkdownUtils.extractFeedback(descriptionLines);

    const typesWithAnswers = [
      "multiple_choice",
      "multiple_answers",
      "matching",
      "short_answer=",
    ];
    const answers = typesWithAnswers.includes(questionType)
      ? getAnswers(lines, questionIndex, questionType)
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
      text: descriptionWithoutFeedback.join("\n"),
      questionType,
      points,
      answers: answersWithoutDistractors,
      matchDistractors: distractors,
      correctComments,
      incorrectComments,
      neutralComments,
    };
    return question;
  },
};
