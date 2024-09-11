"use client"
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import React from "react";

export default function SettingsHeader() {
  const { data: settings } = useLocalCourseSettingsQuery();
  return <h3 className="text-center mb-3">{settings.name} <span className="text-slate-500 text-xl"> settings</span></h3>;
}
