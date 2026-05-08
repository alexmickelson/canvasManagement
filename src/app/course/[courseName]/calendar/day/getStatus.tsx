"use client";
import { CanvasAssignment } from "@/features/canvas/models/assignments/canvasAssignment";
import { CanvasPage } from "@/features/canvas/models/pages/canvasPageModel";
import { CanvasQuiz } from "@/features/canvas/models/quizzes/canvasQuizModel";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { ReactNode } from "react";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";
import { getSyncStatus } from "./getAssignmentSyncStatus";

export const getStatus = ({
  item,
  canvasItem,
  type,
  settings,
}: {
  item: LocalQuiz | LocalAssignment | LocalCoursePage;
  canvasItem?: CanvasQuiz | CanvasAssignment | CanvasPage;
  type: "assignment" | "page" | "quiz";
  settings: LocalCourseSettings;
}): {
  status: "localOnly" | "incomplete" | "published";
  message: ReactNode;
} => {
  return getSyncStatus({ item, canvasItem, type, settings });
};
