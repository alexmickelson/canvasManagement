"use client";
import { CalendarMonthModel, getWeekNumber } from "./calendarMonthUtils";
import { DayOfWeek } from "@/models/local/localCourse";
import Day from "./day/Day";
import { Expandable } from "@/components/Expandable";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";

export const CalendarMonth = ({ month }: { month: CalendarMonthModel }) => {
  const weekInMilliseconds = 604_800_000;
  const four_days_in_milliseconds  = 345_600_000
  const isInPast =
    new Date(month.year, month.month, 1) <
    new Date(Date.now() - four_days_in_milliseconds);

  const monthName = new Date(month.year, month.month - 1, 1).toLocaleString(
    "default",
    { month: "long" }
  );
  const weekDaysList: DayOfWeek[] = Object.values(DayOfWeek);

  return (
    <>
      <Expandable
        defaultExpanded={!isInPast}
        ExpandableElement={({ setIsExpanded }) => (
          <div className="flex justify-center">
            <h3
              className={
                "text-2xl transition-all duration-500 " +
                "hover:text-slate-50 underline hover:scale-105 `"
              }
              onClick={() => setIsExpanded((e) => !e)}
              role="button"
            >
              {monthName}
            </h3>
          </div>
        )}
      >
        <div className="grid grid-cols-7 text-center fw-bold ms-3">
          {weekDaysList.map((day) => (
            <div key={day} className={""}>
              {day}
            </div>
          ))}
        </div>

        {month.daysByWeek.map((week, weekIndex) => (
          <CalendarWeek key={weekIndex} week={week} monthNumber={month.month} />
        ))}
      </Expandable>
    </>
  );
};

function CalendarWeek({
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
      <div className="my-auto text-gray-400">
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
