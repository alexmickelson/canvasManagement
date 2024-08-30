"use client";

import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";


export default function CourseSettings({ courseName }: { courseName: string }) {
  const { data: settings } = useLocalCourseSettingsQuery(courseName);
  return <div>{settings.name}</div>;
}
