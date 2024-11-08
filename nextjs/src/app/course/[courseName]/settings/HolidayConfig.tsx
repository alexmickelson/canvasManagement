"use client";

import TextInput from "@/components/form/TextInput";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromString } from "@/models/local/timeUtils";
import { useEffect, useState } from "react";
import {
  holidaysToString,
  parseHolidays,
} from "../../../../models/local/settingsUtils";

const exampleString = `springBreak:
- 10/12/2024
- 10/13/2024
- 10/14/2024
laborDay:
- 9/1/2024`;

export const holidaysAreEqual = (
  obj1: {
    name: string;
    days: string[];
  }[],
  obj2: {
    name: string;
    days: string[];
  }[]
): boolean => {
  if (obj1.length !== obj2.length) return false;

  const sortedObj1 = [...obj1].sort((a, b) => a.name.localeCompare(b.name));
  const sortedObj2 = [...obj2].sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < sortedObj1.length; i++) {
    const holiday1 = sortedObj1[i];
    const holiday2 = sortedObj2[i];

    if (holiday1.name !== holiday2.name) return false;

    const sortedDays1 = [...holiday1.days].sort();
    const sortedDays2 = [...holiday2.days].sort();

    if (sortedDays1.length !== sortedDays2.length) return false;

    for (let j = 0; j < sortedDays1.length; j++) {
      if (sortedDays1[j] !== sortedDays2[j]) return false;
    }
  }

  return true;
};

export default function HolidayConfig() {
  return (
    <SuspenseAndErrorHandling>
      <InnerHolidayConfig />
    </SuspenseAndErrorHandling>
  );
}
function InnerHolidayConfig() {
  const [settings] = useLocalCourseSettingsQuery();
  console.log(settings.holidays);
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  const [rawText, setRawText] = useState(holidaysToString(settings.holidays));

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const parsed = parseHolidays(rawText);

        if (!holidaysAreEqual(settings.holidays, parsed)) {
          console.log("different holiday configs", settings.holidays, parsed);
          updateSettings.mutate({
            ...settings,
            holidays: parsed,
          });
        }
      } catch (error: any) {}
    }, 500);
    return () => clearTimeout(id);
  }, [rawText, settings.holidays, settings, updateSettings]);

  return (
    <div className=" border w-fit p-3 m-3 rounded-md">
      <div className="flex flex-row gap-3">
        <TextInput
          value={rawText}
          setValue={setRawText}
          label={"Holiday Days"}
          isTextArea={true}
        />
        <div>
          Format your holidays like so:
          <pre>
            <code>{exampleString}</code>
          </pre>
        </div>
      </div>
      <div>
        <SuspenseAndErrorHandling>
          <ParsedHolidaysDisplay value={rawText} />
        </SuspenseAndErrorHandling>
      </div>
    </div>
  );
}

function ParsedHolidaysDisplay({ value }: { value: string }) {
  const [parsedHolidays, setParsedHolidays] = useState<
    {
      name: string;
      days: string[];
    }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const parsed = parseHolidays(value);
      setParsedHolidays(parsed);
      setError("");
    } catch (error: any) {
      setError(error + "");
    }
  }, [value]);

  return (
    <div>
      <div className="text-rose-500">{error}</div>
      {parsedHolidays.map((holiday) => (
        <div key={holiday.name}>
          <div>{holiday.name}</div>
          <div>
            {holiday.days.map((day) => {
              const date = getDateFromString(day);
              return (
                <div key={day}>
                  {date?.toLocaleDateString("en-us", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
