"use client";
import { createContext, useContext } from "react";

export interface CourseContextInterface {
  courseName: string;
}

const defaultValue: CourseContextInterface = {
  courseName: "",
};

export const CourseContext =
  createContext<CourseContextInterface>(defaultValue);

export function useCourseContext() {
  return useContext(CourseContext);
}

