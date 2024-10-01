"use client";

import TextInput from "@/components/form/TextInput";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { useEffect, useState } from "react";

export default function DefaultLockOffset() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const [hoursOffset, setHoursOffset] = useState(
    settings.defaultLockHoursOffset?.toString() ?? "0"
  );

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const hoursNumber = parseInt(hoursOffset);
        if (
          !Number.isNaN(hoursNumber) &&
          hoursNumber !== settings.defaultLockHoursOffset
        ) {
          updateSettings.mutate({
            ...settings,
            defaultLockHoursOffset: hoursNumber,
          });
        }
      } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [hoursOffset, settings, settings.defaultLockHoursOffset, updateSettings]);

  return (
    <div>
      <div className="text-center">Default Assignment Due Time</div>
      <hr className="m-1 p-0" />

      <TextInput
        value={hoursOffset}
        setValue={(n) => setHoursOffset(n)}
        label={"Hours Offset"}
      />
    </div>
  );
}
