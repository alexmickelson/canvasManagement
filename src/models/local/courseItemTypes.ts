import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalAssignment } from "../../features/local/assignments/models/localAssignment";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";

export type CourseItemType = "Assignment" | "Quiz" | "Page";
export type CourseItemReturnType<T extends CourseItemType> =
  T extends "Assignment"
    ? LocalAssignment
    : T extends "Quiz"
    ? LocalQuiz
    : LocalCoursePage;

export const typeToFolder = {
  Assignment: "assignments",
  Quiz: "quizzes",
  Page: "pages",
} as const;
