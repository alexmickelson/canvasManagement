"use client"
import { ReactNode } from "react";
import { CourseContext } from "./courseContext";
import { useLocalCourseDetailsQuery } from "@/hooks/localCoursesHooks";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const { data: course } = useLocalCourseDetailsQuery(localCourseName);
  return (
    <CourseContext.Provider value={{ localCourse: course }}>
      {children}
    </CourseContext.Provider>
  );
}
