"use client";

import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { TimePicker } from "../../../../components/TimePicker";
import { useState } from "react";
import DefaultLockOffset from "./DefaultLockOffset";

export default function DefaultDueTime() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const [haveLockOffset, setHaveLockOffset] = useState(
    !!settings.defaultLockHoursOffset
  );
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
      <hr />
      {!haveLockOffset && (
        <button
          onClick={async () => {
            await updateSettings.mutateAsync({
              ...settings,
              defaultLockHoursOffset: 0,
            });
            setHaveLockOffset(true);
          }}
        >
          have a default Lock Offset?
        </button>
      )}

      {haveLockOffset && <DefaultLockOffset />}
      <br />
      {haveLockOffset && (
        <button
          className="btn-danger"
          onClick={async () => {
            await updateSettings.mutateAsync({
              ...settings,
              defaultLockHoursOffset: undefined,
            });
            setHaveLockOffset(false);
          }}
        >
          remove default Lock Offset?
        </button>
      )}
    </div>
  );
}
