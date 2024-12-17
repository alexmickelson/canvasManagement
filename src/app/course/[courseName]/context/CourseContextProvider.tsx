"use client"
import { ReactNode } from "react";
import { CourseContext } from "./courseContext";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  return (
    <CourseContext.Provider
      value={{
        courseName: localCourseName,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
