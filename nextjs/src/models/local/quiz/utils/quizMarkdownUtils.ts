import {
  verifyDateOrThrow,
  verifyDateStringOrUndefined,
} from "../../timeUtils";
import { LocalQuiz } from "../localQuiz";
import { quizQuestionMarkdownUtils } from "./quizQuestionMarkdownUtils";

const extractLabelValue = (input: string, label: string): string => {
  const pattern = new RegExp(`${label}: (.*?)\n`);
  const match = pattern.exec(input);
  return match ? match[1].trim() : "";
};

const extractDescription = (input: string): string => {
  const pattern = new RegExp("Description: (.*?)$", "s");
  const match = pattern.exec(input);
  return match ? match[1].trim() : "";
};

const parseBooleanOrThrow = (value: string, label: string): boolean => {
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  throw new Error(`Error with ${label}: ${value}`);
};

const parseBooleanOrDefault = (
  value: string,
  label: string,
  defaultValue: boolean
): boolean => {
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return defaultValue;
};

const parseNumberOrThrow = (value: string, label: string): number => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Error with ${label}: ${value}`);
  }
  return parsed;
};
const getQuizWithOnlySettings = (settings: string): LocalQuiz => {
  const name = extractLabelValue(settings, "Name");

  const rawShuffleAnswers = extractLabelValue(settings, "ShuffleAnswers");
  const shuffleAnswers = parseBooleanOrThrow(
    rawShuffleAnswers,
    "ShuffleAnswers"
  );

  const password = extractLabelValue(settings, "Password") || undefined;

  const rawShowCorrectAnswers = extractLabelValue(
    settings,
    "ShowCorrectAnswers"
  );
  const showCorrectAnswers = parseBooleanOrDefault(
    rawShowCorrectAnswers,
    "ShowCorrectAnswers",
    true
  );

  const rawOneQuestionAtATime = extractLabelValue(
    settings,
    "OneQuestionAtATime"
  );
  const oneQuestionAtATime = parseBooleanOrThrow(
    rawOneQuestionAtATime,
    "OneQuestionAtATime"
  );

  const rawAllowedAttempts = extractLabelValue(settings, "AllowedAttempts");
  const allowedAttempts = parseNumberOrThrow(
    rawAllowedAttempts,
    "AllowedAttempts"
  );

  const rawDueAt = extractLabelValue(settings, "DueAt");
  const dueAt = verifyDateOrThrow(rawDueAt, "DueAt");

  const rawLockAt = extractLabelValue(settings, "LockAt");
  const lockAt = verifyDateStringOrUndefined(rawLockAt);

  const description = extractDescription(settings);
  const localAssignmentGroupName = extractLabelValue(
    settings,
    "AssignmentGroup"
  );

  const quiz: LocalQuiz = {
    name,
    description,
    password,
    lockAt,
    dueAt,
    shuffleAnswers,
    showCorrectAnswers,
    oneQuestionAtATime,
    localAssignmentGroupName,
    allowedAttempts,
    questions: [],
  };
  return quiz;
};

export const quizMarkdownUtils = {
  toMarkdown(quiz: LocalQuiz): string {
    if (!quiz) {
      throw Error(`quiz was undefined, cannot parse markdown`);
    }
    if (
      typeof quiz.questions === "undefined" ||
      typeof quiz.oneQuestionAtATime === "undefined"
    ) {
      console.log("quiz is probably not a quiz", quiz);
      throw Error(`quiz ${quiz.name} is probably not a quiz`);
    }
    const questionMarkdownArray = quiz.questions.map((q) =>
      quizQuestionMarkdownUtils.toMarkdown(q)
    );
    const questionDelimiter = "\n\n---\n\n";
    const questionMarkdown = questionMarkdownArray.join(questionDelimiter);

    return `Name: ${quiz.name}
LockAt: ${quiz.lockAt ?? ""}
DueAt: ${quiz.dueAt}
Password: ${quiz.password ?? ""}
ShuffleAnswers: ${quiz.shuffleAnswers.toString().toLowerCase()}
ShowCorrectAnswers: ${quiz.showCorrectAnswers.toString().toLowerCase()}
OneQuestionAtATime: ${quiz.oneQuestionAtATime.toString().toLowerCase()}
AssignmentGroup: ${quiz.localAssignmentGroupName}
AllowedAttempts: ${quiz.allowedAttempts}
Description: ${quiz.description}
---
${questionMarkdown}`;
  },

  parseMarkdown(input: string): LocalQuiz {
    const splitInput = input.split("---\n");
    const settings = splitInput[0];
    const quizWithoutQuestions = getQuizWithOnlySettings(settings);

    const rawQuestions = splitInput.slice(1);
    const questions = rawQuestions
      .filter((str) => str.trim().length > 0)
      .map((q, i) => quizQuestionMarkdownUtils.parseMarkdown(q, i));

    return {
      ...quizWithoutQuestions,
      questions,
    };
  },
};
