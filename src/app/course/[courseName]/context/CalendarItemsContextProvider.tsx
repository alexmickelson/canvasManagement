"use client";
import { ReactNode } from "react";
import {
  CalendarItemsContext,
  CalendarItemsInterface,
} from "./calendarItemsContext";
import {
  useCourseQuizzesByModuleByDateQuery,
  useCourseAssignmentsByModuleByDateQuery,
  useCoursePagesByModuleByDateQuery,
} from "@/features/local/modules/localCourseModuleHooks";

export default function CalendarItemsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const quizzesByModuleByDate = useCourseQuizzesByModuleByDateQuery();
  const assignmentsByModuleByDate = useCourseAssignmentsByModuleByDateQuery();
  const pagesByModuleByDate = useCoursePagesByModuleByDateQuery();

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
