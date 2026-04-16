"use client";

import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";
import { ReactNode } from "react";
import { useCalendarItemsContext } from "../../context/calendarItemsContext";
import { getStatus } from "./getStatus";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useCanvasAssignmentsQuery } from "@/features/canvas/hooks/canvasAssignmentHooks";
import { useCanvasPagesQuery } from "@/features/canvas/hooks/canvasPageHooks";
import { useCanvasQuizzesQuery } from "@/features/canvas/hooks/canvasQuizHooks";
import { IModuleItem } from "@/features/local/modules/IModuleItem";

export type TodayItem = {
  type: "assignment" | "quiz" | "page";
  item: IModuleItem;
  moduleName: string;
  status: "localOnly" | "incomplete" | "published";
  message: ReactNode;
};

export function useTodaysItems(day: string) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day items",
  );
  const itemsContext = useCalendarItemsContext();
  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: canvasPages } = useCanvasPagesQuery();

  const assignments: TodayItem[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].assignments.map((assignment) => {
          const canvasAssignment = canvasAssignments?.find(
            (c) => c.name === assignment.name,
          );
          return {
            type: "assignment" as const,
            item: assignment,
            moduleName,
            ...getStatus({
              item: assignment,
              canvasItem: canvasAssignment,
              type: "assignment",
              settings,
            }),
          };
        }),
      )
    : [];

  const quizzes: TodayItem[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].quizzes.map((quiz) => {
          const canvasQuiz = canvasQuizzes?.find((q) => q.title === quiz.name);
          return {
            type: "quiz" as const,
            item: quiz,
            moduleName,
            ...getStatus({
              item: quiz,
              canvasItem: canvasQuiz,
              type: "quiz",
              settings,
            }),
          };
        }),
      )
    : [];

  const pages: TodayItem[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].pages.map((page) => {
          const canvasPage = canvasPages?.find((p) => p.title === page.name);
          return {
            type: "page" as const,
            item: page,
            moduleName,
            ...getStatus({
              item: page,
              canvasItem: canvasPage,
              type: "page",
              settings,
            }),
          };
        }),
      )
    : [];

  const todaysItems = [...assignments, ...quizzes, ...pages].sort((a, b) => {
    const dateDiff =
      getDateFromStringOrThrow(a.item.dueAt, "sorting today items").getTime() -
      getDateFromStringOrThrow(b.item.dueAt, "sorting today items").getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.item.name.localeCompare(b.item.name);
  });

  return { todaysItems };
}
