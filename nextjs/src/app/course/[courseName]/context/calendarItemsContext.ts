import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
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
