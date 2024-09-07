"use client";

import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";

export default function CourseSettings() {
  const { data: settings } = useLocalCourseSettingsQuery();
  return <div>{settings.name}</div>;
}
