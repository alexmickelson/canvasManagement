"use client";

import { useLocalCoursesSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import OneCourseLectures from "./OneCourseLectures";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import CourseContextProvider from "../course/[courseName]/context/CourseContextProvider";

export default function TodaysLectures() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();
  return (
    <div className="w-full">
      {/* <h3 className="text-center text-slate-400">todays lectures</h3> */}
      <div className="flex justify-around w-full">
        <SuspenseAndErrorHandling>
          {allSettings.map((settings) => (
            <div key={settings.name} className="flex-shrink">
              <CourseContextProvider localCourseName={settings.name}>
                <OneCourseLectures />
              </CourseContextProvider>
            </div>
          ))}
        </SuspenseAndErrorHandling>
      </div>
    </div>
  );
}