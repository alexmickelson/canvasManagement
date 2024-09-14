"use client";
import { useState } from "react";
import { CalendarMonthModel } from "./calendarMonthUtils";
import { DayOfWeek } from "@/models/local/localCourse";
import Day from "./Day";

export const CalendarMonth = ({ month }: { month: CalendarMonthModel }) => {
  const weekInMilliseconds = 604_800_000;
  const isInPast =
    new Date(month.year, month.month, 1) <
    new Date(Date.now() - weekInMilliseconds);

  const [isCollapsed, setIsCollapsed] = useState(isInPast);

  const monthName = new Date(month.year, month.month - 1, 1).toLocaleString(
    "default",
    { month: "long" }
  );
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const weekDaysList: DayOfWeek[] = Object.values(DayOfWeek);

  return (
    <>
      <div className="flex justify-center">
        <h3
          className={
            "text-2xl transition-all duration-500 " +
            "hover:text-slate-50 underline hover:scale-105 `"
          }
          onClick={toggleCollapse}
          role="button"
        >
          {monthName}
        </h3>
      </div>

      <div
        id={monthName}
        className={"collapsible " + (isCollapsed ? "" : "expand")}
      >
        <div className="grid grid-cols-7 text-center fw-bold">
          {weekDaysList.map((day) => (
            <div key={day} className={""}>
              {day}
            </div>
          ))}
        </div>

        {month.daysByWeek.map((week, weekIndex) => (
          <CalendarWeek key={weekIndex} week={week} monthNumber={month.month} />
        ))}
      </div>
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
  return (
    <div className="grid grid-cols-7 m-1">
      {week.map((day, dayIndex) => (
        <Day key={dayIndex} day={day} month={monthNumber} />
      ))}
    </div>
  );
}
