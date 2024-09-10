"use client"
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import React from "react";

export default function SettingsHeader() {
  const { data: settings } = useLocalCourseSettingsQuery();
  return <div>Settings for {settings.name}</div>;
}
