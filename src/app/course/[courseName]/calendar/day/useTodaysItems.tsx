"use client";
import { useCanvasAssignmentsQuery } from "@/hooks/canvas/canvasAssignmentHooks";
import { useCanvasPagesQuery } from "@/hooks/canvas/canvasPageHooks";
import { useCanvasQuizzesQuery } from "@/hooks/canvas/canvasQuizHooks";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/utils/timeUtils";
import { ReactNode } from "react";
import { useCalendarItemsContext } from "../../context/calendarItemsContext";
import { getStatus } from "./getStatus";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";

export function useTodaysItems(day: string) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day items"
  );
  const itemsContext = useCalendarItemsContext();
  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: canvasPages } = useCanvasPagesQuery();
  const todaysAssignments: {
    moduleName: string;
    assignment: LocalAssignment;
    status: "localOnly" | "incomplete" | "published";
    message: ReactNode;
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].assignments.map((assignment) => {
          const canvasAssignment = canvasAssignments?.find(
            (c) => c.name === assignment.name
          );
          return {
            moduleName,
            assignment,
            ...getStatus({
              item: assignment,
              canvasItem: canvasAssignment,
              type: "assignment",
              settings,
            }),
          };
        })
      )
    : [];

  const todaysQuizzes: {
    moduleName: string;
    quiz: LocalQuiz;
    status: "localOnly" | "incomplete" | "published";
    message: ReactNode;
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].quizzes.map((quiz) => {
          const canvasQuiz = canvasQuizzes?.find((q) => q.title === quiz.name);
          return {
            moduleName,
            quiz,
            ...getStatus({
              item: quiz,
              canvasItem: canvasQuiz,
              type: "quiz",
              settings,
            }),
          };
        })
      )
    : [];

  const todaysPages: {
    moduleName: string;
    page: LocalCoursePage;
    status: "localOnly" | "incomplete" | "published";
    message: ReactNode;
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].pages.map((page) => {
          const canvasPage = canvasPages?.find((p) => p.title === page.name);
          return {
            moduleName,
            page,
            ...getStatus({
              item: page,
              canvasItem: canvasPage,
              type: "page",
              settings,
            }),
          };
        })
      )
    : [];
  return { todaysAssignments, todaysQuizzes, todaysPages };
}
