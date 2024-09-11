"use client";
import { Spinner } from "@/components/Spinner";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { DayOfWeek } from "@/models/local/localCourse";
import React from "react";

export default function DaysOfWeekSelector() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  return (
    <>
      <div className="flex flex-row gap-3">
        {Object.values(DayOfWeek).map((day) => {
          const hasDay = settings.daysOfWeek.includes(day);
          return (
            <button
              key={day}
              className={
                hasDay
                  ? "bg-blue-300 text-blue-950 border-blue-500 border"
                  : "bg-slate-900 border-blue-900 border "
              }
              onClick={() => {
                updateSettings.mutate({
                  ...settings,
                  daysOfWeek: hasDay
                    ? settings.daysOfWeek.filter((d) => d !== day)
                    : [day, ...settings.daysOfWeek],
                });
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
      {updateSettings.isPending && <Spinner />}
    </>
  );
}
