import { ReactNode } from "react";
import { useCourseContext } from "./courseContext";
import {
  useAllCourseDataQuery,
} from "@/hooks/localCourse/localCoursesHooks";
import {
  CalendarItemsContext,
  CalendarItemsInterface,
} from "./calendarItemsContext";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";

export default function CalendarItemsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { assignmentsAndModules, quizzesAndModules, pagesAndModules } =
    useAllCourseDataQuery();

  const assignmentsByModuleByDate = assignmentsAndModules.reduce(
    (previous, { assignment, moduleName }) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(
          assignment.dueAt,
          "due at for assignment in items context"
        )
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        assignments: [],
      };

      const updatedModule = {
        ...previousModule,
        assignments: [...previousModule.assignments, assignment],
      };

      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );

  const quizzesByModuleByDate = quizzesAndModules.reduce(
    (previous, { quiz, moduleName }) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(quiz.dueAt, "due at for quiz in items context")
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        quizzes: [],
      };

      const updatedModule = {
        ...previousModule,
        quizzes: [...previousModule.quizzes, quiz],
      };

      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );

  const pagesByModuleByDate = pagesAndModules.reduce(
    (previous, { page, moduleName }) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(page.dueAt, "due at for quiz in items context")
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        pages: [],
      };

      const updatedModule = {
        ...previousModule,
        pages: [...previousModule.pages, page],
      };

      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );

  const allDays = [
    ...new Set([
      ...Object.keys(assignmentsByModuleByDate),
      ...Object.keys(quizzesByModuleByDate),
      ...Object.keys(pagesByModuleByDate),
    ]),
  ];

  const allItemsByModuleByDate = allDays.reduce((prev, day) => {
    const assignmentModulesInDay = assignmentsByModuleByDate[day] ?? {};
    const quizModulesInDay = quizzesByModuleByDate[day] ?? {};
    const pageModulesInDay = pagesByModuleByDate[day] ?? {};

    const allModules = [
      ...new Set([
        ...Object.keys(assignmentModulesInDay),
        ...Object.keys(quizModulesInDay),
        ...Object.keys(pageModulesInDay),
      ]),
    ];

    const modulesInDate = allModules.reduce((prev, moduleName) => {
      return {
        ...prev,
        [moduleName]: {
          assignments: assignmentModulesInDay[moduleName]
            ? assignmentModulesInDay[moduleName].assignments
            : [],
          quizzes: quizModulesInDay[moduleName]
            ? quizModulesInDay[moduleName].quizzes
            : [],
          pages: pageModulesInDay[moduleName]
            ? pageModulesInDay[moduleName].pages
            : [],
        },
      };
    }, {});

    return { ...prev, [day]: modulesInDate };
  }, {} as CalendarItemsInterface);

  return (
    <CalendarItemsContext.Provider value={allItemsByModuleByDate}>
      {children}
    </CalendarItemsContext.Provider>
  );
}
