"use client";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { getWeekNumber } from "./calendarMonthUtils";
import Day from "./day/Day";

export function CalendarWeek({
  week,
  monthNumber,
}: {
  week: string[]; //date strings
  monthNumber: number;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const startDate = getDateFromStringOrThrow(
    settings.startDate,
    "week calculation start date"
  );
  const firstDateString = getDateFromStringOrThrow(
    week[0],
    "week calculation first day of week"
  );
  const weekNumber = getWeekNumber(startDate, firstDateString);
  return (
    <div className="flex flex-row">
      <div className="my-auto text-gray-400 w-6">
        {weekNumber.toString().padStart(2, "0")}
      </div>
      <div className="grid grid-cols-7 grow">
        {week.map((day, dayIndex) => (
          <Day key={dayIndex} day={day} month={monthNumber} />
        ))}
      </div>
    </div>
  );
}
