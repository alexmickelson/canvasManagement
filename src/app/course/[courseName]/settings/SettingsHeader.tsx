"use client";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import React from "react";
import { useCourseContext } from "../context/courseContext";

export default function SettingsHeader() {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="my-auto">
          <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
            Back To Course
          </Link>
        </div>
        <h3 className="text-center mb-3">
          {settings.name}{" "}
          <span className="text-slate-500 text-xl"> settings</span>
        </h3>
        <div></div>
      </div>
      <hr />
    </>
  );
}
