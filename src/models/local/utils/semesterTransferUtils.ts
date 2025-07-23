import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalAssignment } from "../../../features/local/assignments/models/localAssignment";
import { Lecture } from "../../../features/local/lectures/lectureModel";
import { dateToMarkdownString, getDateFromStringOrThrow } from "./timeUtils";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";

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
    githubClassroomAssignmentLink: undefined,
    githubClassroomAssignmentShareLink: undefined,
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
export const prepLectureForNewSemester = (
  lecture: Lecture,
  oldSemesterStartDate: string,
  newSemesterStartDate: string
): Lecture => {
  const updatedText = replaceClassroomUrl(lecture.content);
  const newDate = newDateOffset(
    lecture.date,
    oldSemesterStartDate,
    newSemesterStartDate
  );
  const newDateOnly = newDate?.split(" ")[0];
  return {
    ...lecture,
    content: updatedText,
    date: newDateOnly ?? lecture.date,
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
