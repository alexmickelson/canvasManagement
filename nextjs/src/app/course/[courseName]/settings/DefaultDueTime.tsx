"use client";

import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { TimePicker } from "../../../../components/TimePicker";

export default function DefaultDueTime() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  return (
    <div className="border w-fit p-3 m-3 rounded-md">
      <div className="text-center">Default Assignment Due Time</div>
      <hr className="m-1 p-0" />
      <TimePicker
        time={settings.defaultDueTime}
        setChosenTime={(simpleTime) => {
          console.log(simpleTime);
          updateSettings.mutate({
            ...settings,
            defaultDueTime: simpleTime,
          });
        }}
      />
    </div>
  );
}
