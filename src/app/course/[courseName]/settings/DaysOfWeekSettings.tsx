"use client";
import { DayOfWeekInput } from "@/components/form/DayOfWeekInput";
import { Spinner } from "@/components/Spinner";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import React from "react";

export default function DaysOfWeekSettings() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  return (
    <>
      <DayOfWeekInput
        selectedDays={settings.daysOfWeek}
        updateSettings={(day) => {
          const hasDay = settings.daysOfWeek.includes(day);

          updateSettings.mutate({
            settings: {
              ...settings,
              daysOfWeek: hasDay
                ? settings.daysOfWeek.filter((d) => d !== day)
                : [day, ...settings.daysOfWeek],
            },
          });
        }}
      />
      {updateSettings.isPending && <Spinner />}
    </>
  );
}
