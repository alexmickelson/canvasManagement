"use client";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateOnlyMarkdownString } from "@/models/local/utils/timeUtils";
import React from "react";
import { settingsBox } from "./sharedSettings";

export default function StartAndEndDate() {
  const [settings] = useLocalCourseSettingsQuery();
  const startDate = new Date(settings.startDate);
  const endDate = new Date(settings.endDate);
  return (
    <div className={settingsBox}>
      <div>Semester Start: {getDateOnlyMarkdownString(startDate)}</div>
      <div>Semester End: {getDateOnlyMarkdownString(endDate)}</div>
    </div>
  );
}
