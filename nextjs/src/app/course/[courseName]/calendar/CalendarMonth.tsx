"use client";
import { useState } from "react";
import { CalendarMonthModel } from "./calendarMonthUtils";
import { DayOfWeek } from "@/models/local/localCourse";
import Day from "./Day";

export const CalendarMonth = ({ month }: { month: CalendarMonthModel }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isInPast =
    new Date(month.year, month.month - 1, 1) < new Date(Date.now());
  const monthName = new Date(month.year, month.month - 1, 1).toLocaleString(
    "default",
    { month: "long" }
  );
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  // const collapseClass = isInPast ? "collapse _hide" : "collapse _show";
  const weekDaysList: DayOfWeek[] = Object.values(DayOfWeek);

  return (
    <>
      <h3 className="text-center text-2xl">
        <button
          type="button"
          className="btn btn-link"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-controls={monthName}
        >
          {monthName}
        </button>
      </h3>

      <div id={monthName}>
        <div className="grid grid-cols-7 text-center fw-bold">
          {weekDaysList.map((day) => (
            <div key={day} className={""}>
              {day}
            </div>
          ))}
        </div>

        {month.daysByWeek.map((week, weekIndex) => (
          <div className="grid grid-cols-7 m-3" key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Day key={dayIndex} day={day} month={month.month} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
