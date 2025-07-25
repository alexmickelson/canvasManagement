"use client";

import { useLocalCoursesSettingsQuery } from "@/features/local/course/localCoursesHooks";
import OneCourseLectures from "./OneCourseLectures";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import CourseContextProvider from "../course/[courseName]/context/CourseContextProvider";
import { Fragment } from "react";

export default function TodaysLectures() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();
  return (
    <div className="w-full">
      <div className="flex justify-around w-full">
        <SuspenseAndErrorHandling>
          {allSettings.map((settings) => (
            <Fragment key={settings.name}>
              <CourseContextProvider localCourseName={settings.name}>
                <OneCourseLectures />
              </CourseContextProvider>
            </Fragment>
          ))}
        </SuspenseAndErrorHandling>
      </div>
    </div>
  );
}
