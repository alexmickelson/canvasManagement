"use client";
import { useLocalCourseDetailsQuery } from "@/hooks/localCoursesHooks";
import { CourseContext } from "./course/[courseName]/courseContext";
import CourseDetails from "./course/[courseName]/CourseDetails";

export default function CourseDetailsWrapper({
  courseName,
}: {
  courseName: string;
}) {
  const { data: course } = useLocalCourseDetailsQuery(courseName);
  console.log("courseName", courseName);
  return (
    <CourseContext.Provider value={{ localCourse: course }}>
      <CourseDetails />
    </CourseContext.Provider>
  );
}
