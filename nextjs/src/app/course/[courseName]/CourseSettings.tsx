"use client";

import { useCourseContext } from "./context/courseContext";

export default function CourseSettings() {
  const context = useCourseContext();
  return <div>{context.localCourse.settings.name}</div>;
}
