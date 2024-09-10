"use client";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateOnlyMarkdownString } from "@/models/local/timeUtils";
import React from "react";

export default function StartAndEndDate() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const startDate = new Date(settings.startDate);
  const endDate = new Date(settings.endDate);
  return (
    <div>
      <div>Start: {getDateOnlyMarkdownString(startDate)}</div>
      <div>End: {getDateOnlyMarkdownString(endDate)}</div>
    </div>
  );
}
