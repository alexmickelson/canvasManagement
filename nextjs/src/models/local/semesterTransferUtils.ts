import { LocalAssignment } from "./assignment/localAssignment";
import { LocalCoursePage } from "./page/localCoursePage";
import { LocalQuiz } from "./quiz/localQuiz";
import {
  dateToMarkdownString,
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "./timeUtils";

export const prepAssignmentForNewSemester = (
  assignment: LocalAssignment,
  oldSemesterStartDate: string,
  newSemesterStartDate: string
): LocalAssignment => {
  const descriptionWithoutGithubClassroom = replaceClassroomUrl(
    assignment.description
  );
  return {
    ...assignment,
    description: descriptionWithoutGithubClassroom,
    dueAt:
      newDateOffset(
        assignment.dueAt,
        oldSemesterStartDate,
        newSemesterStartDate
      ) ?? assignment.dueAt,
    lockAt: newDateOffset(
      assignment.lockAt,
      oldSemesterStartDate,
      newSemesterStartDate
    ),
  };
};

export const prepQuizForNewSemester = (
  quiz: LocalQuiz,
  oldSemesterStartDate: string,
  newSemesterStartDate: string
): LocalQuiz => {
  const descriptionWithoutGithubClassroom = replaceClassroomUrl(
    quiz.description
  );
  return {
    ...quiz,
    description: descriptionWithoutGithubClassroom,
    dueAt:
      newDateOffset(quiz.dueAt, oldSemesterStartDate, newSemesterStartDate) ??
      quiz.dueAt,
    lockAt: newDateOffset(
      quiz.lockAt,
      oldSemesterStartDate,
      newSemesterStartDate
    ),
  };
};

export const prepPageForNewSemester = (
  page: LocalCoursePage,
  oldSemesterStartDate: string,
  newSemesterStartDate: string
): LocalCoursePage => {
  const updatedText = replaceClassroomUrl(page.text);
  return {
    ...page,
    text: updatedText,
    dueAt:
      newDateOffset(page.dueAt, oldSemesterStartDate, newSemesterStartDate) ??
      page.dueAt,
  };
};

const replaceClassroomUrl = (value: string) => {
  const classroomPattern =
    /https:\/\/classroom\.github\.com\/[a-zA-Z0-9\/._-]+/g;
  const withoutGithubClassroom = value.replace(
    classroomPattern,
    "insert_github_classroom_url"
  );
  return withoutGithubClassroom;
};

const newDateOffset = (
  dateString: string | undefined,
  oldSemesterStartDate: string,
  newSemesterStartDate: string
) => {
  if (!dateString) return dateString;
  const oldStart = getDateFromStringOrThrow(
    oldSemesterStartDate,
    "semester start date in new semester offset"
  );
  const newStart = getDateFromStringOrThrow(
    newSemesterStartDate,
    "new semester start date in new semester offset"
  );
  const date = getDateFromStringOrThrow(
    dateString,
    "date in new semester offset"
  );
  const offset = date.getTime() - oldStart.getTime();

  const newUnixTime = offset + newStart.getTime();

  const newDate = new Date(newUnixTime);

  return dateToMarkdownString(newDate);
};
