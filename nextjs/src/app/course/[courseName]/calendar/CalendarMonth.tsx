"use client";
import { CalendarMonthModel, getWeekNumber } from "./calendarMonthUtils";
import { DayOfWeek } from "@/models/local/localCourseSettings";
import { Expandable } from "@/components/Expandable";
import { CalendarWeek } from "./CalendarWeek";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/utils/timeUtils";

export const CalendarMonth = ({ month }: { month: CalendarMonthModel }) => {
  // const weekInMilliseconds = 604_800_000;
  const four_days_in_milliseconds = 345_600_000;
  const [settings] = useLocalCourseSettingsQuery();
  const startDate = getDateFromStringOrThrow(
    settings.startDate,
    "week calculation start date"
  );

  const pastWeekNumber = getWeekNumber(
    startDate,
    new Date(Date.now() - four_days_in_milliseconds)
  );

  const startOfMonthWeekNumber = getWeekNumber(
    startDate,
    new Date(month.year, month.month, 1)
  );

  const isInPast = pastWeekNumber >= startOfMonthWeekNumber;

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
                "hover:text-slate-50 underline hover:scale-105 "
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
              <span className="hidden xl:inline">{day}</span>
              <span className="xl:hidden inline">{day.slice(0, 3)}</span>
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
