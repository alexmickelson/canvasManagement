"use client";

import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { TimePicker } from "../../../../components/TimePicker";
import { useState } from "react";
import DefaultLockOffset from "./DefaultLockOffset";
import { settingsBox } from "./sharedSettings";

export default function DefaultDueTime() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const [haveLockOffset, setHaveLockOffset] = useState(
    typeof settings.defaultLockHoursOffset !== "undefined"
  );
  return (
    <div className={settingsBox}>
      <div className="text-center">Default Assignment Due Time</div>
      <hr className="m-1 p-0" />
      <TimePicker
        time={settings.defaultDueTime}
        setChosenTime={(simpleTime) => {
          console.log(simpleTime);
          updateSettings.mutate({
            settings: {
              ...settings,
              defaultDueTime: simpleTime,
            },
          });
        }}
      />
      <hr />
      {!haveLockOffset && (
        <button
          onClick={async () => {
            await updateSettings.mutateAsync({
              settings: {
                ...settings,
                defaultLockHoursOffset: 0,
              },
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
              settings: {
                ...settings,
                defaultLockHoursOffset: undefined,
              },
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
