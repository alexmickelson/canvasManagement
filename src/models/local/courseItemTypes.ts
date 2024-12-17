import { LocalAssignment } from "./assignment/localAssignment";
import { LocalCoursePage } from "./page/localCoursePage";
import { LocalQuiz } from "./quiz/localQuiz";

export type CourseItemType = "Assignment" | "Quiz" | "Page";
export type CourseItemReturnType<T extends CourseItemType> = T extends "Assignment"
  ? LocalAssignment
  : T extends "Quiz"
  ? LocalQuiz
  : LocalCoursePage;


export const typeToFolder = {
  Assignment: "assignments",
  Quiz: "quizzes",
  Page: "pages",
} as const;
