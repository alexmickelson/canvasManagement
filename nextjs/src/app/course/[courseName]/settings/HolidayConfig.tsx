"use client";

import TextInput from "@/components/form/TextInput";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import {
  dateToMarkdownString,
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
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
  obj1: { [key: string]: string[] },
  obj2: { [key: string]: string[] }
): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key)) return false;

    const arr1 = obj1[key];
    const arr2 = obj2[key];

    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) return false;
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
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  const [rawText, setRawText] = useState(holidaysToString(settings.holidays));

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const parsed = parseHolidays(rawText);

        if (!holidaysAreEqual(settings.holidays, parsed))
          updateSettings.mutate({
            ...settings,
            holidays: parsed,
          });
      } catch (error: any) {}
    }, 500);
    return () => clearTimeout(id);
  }, [rawText, settings, updateSettings]);

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
  const [parsedHolidays, setParsedHolidays] = useState<{
    [holidayName: string]: string[];
  }>({});
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
      {Object.keys(parsedHolidays).map((k) => (
        <div key={k}>
          <div>{k}</div>
          <div>
            {parsedHolidays[k].map((day) => {
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
