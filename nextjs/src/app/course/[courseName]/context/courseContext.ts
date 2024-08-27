"use client";
import { LocalCourse } from "@/models/local/localCourse";
import { createContext, useContext } from "react";

export interface CourseContextInterface {
  localCourse: LocalCourse;
}

const defaultValue: CourseContextInterface = {
  localCourse: {
    modules: [],
    settings: {
      name: "",
      assignmentGroups: [],
      daysOfWeek: [],
      startDate: "",
      endDate: "",
      defaultDueTime: {
        hour: 0,
        minute: 0,
      },
    },
  },
};

export const CourseContext =
  createContext<CourseContextInterface>(defaultValue);

export function useCourseContext() {
  return useContext(CourseContext);
}
