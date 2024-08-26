import { useState } from "react";
import { CalendarMonthModel } from "./calendarMonthUtils";
import { DayOfWeek, LocalCourse } from "@/models/local/localCourse";
import Day from "./Day";

export default function CalendarMonth({
  month,
  localCourse,
}: {
  month: CalendarMonthModel;
  localCourse: LocalCourse;
}) {
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
      <h3 className="text-center">
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
            <div
              key={day}
              className={
                localCourse?.settings.daysOfWeek.includes(day)
                  ? "col"
                  : "col text-secondary"
              }
            >
              {day}
            </div>
          ))}
        </div>

        {month.daysByWeek.map((week, weekIndex) => (
          <div className="grid grid-cols-7 m-3" key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Day key={dayIndex} day={day} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
