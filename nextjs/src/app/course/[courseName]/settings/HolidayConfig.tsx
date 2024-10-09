"use client";

import TextInput from "@/components/form/TextInput";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/timeUtils";
import { useState } from "react";

const exampleString = `springBreak:
- 10/12/2024
- 10/13/2024
- 10/14/2024
laborDay:
- 9/1/2024`;

export default function HolidayConfig() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  const [rawText, setRawText] = useState("");

  const parsedText = parseHolidays(rawText);

  return (
    <div className="flex flex-row gap-3 border w-fit p-3 m-3 rounded-md">
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
      <div>
        {Object.keys(parsedText).map((k) => (
          <div key={k}>
            <div>{k}</div>
            <div>
              {parsedText[k].map((day) => {
                const parsedDate = getDateFromStringOrThrow(
                  day,
                  "holiday preview display"
                );
                return <div key={day}>{dateToMarkdownString(parsedDate)}</div>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const parseHolidays = (
  inputText: string
): { [holidayName: string]: string[] } => {
  const holidays: { [holidayName: string]: string[] } = {};
    
    const lines = inputText.split("\n").filter(line => line.trim() !== "");
    let currentHoliday: string | null = null;

    lines.forEach(line => {
        if (line.includes(":")) {
            // It's a holiday name
            const holidayName = line.split(":")[0].trim();
            currentHoliday = holidayName;
            holidays[currentHoliday] = [];
        } else if (currentHoliday && line.startsWith("-")) {
            // It's a date under the current holiday
            const date = line.replace("-", "").trim();
            holidays[currentHoliday].push(date);
        }
    });

    return holidays;
};
