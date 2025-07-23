import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { createContext, useContext } from "react";

export interface CalendarItemsInterface {
  [
    key: string // representing a date
  ]: {
    [moduleName: string]: {
      assignments: LocalAssignment[];
      quizzes: LocalQuiz[];
      pages: LocalCoursePage[];
    };
  };
}

export const CalendarItemsContext = createContext<CalendarItemsInterface>({});

export function useCalendarItemsContext() {
  return useContext(CalendarItemsContext);
}
