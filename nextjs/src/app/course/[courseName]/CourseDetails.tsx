"use client";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "./courseContext";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import CalendarMonth from "./CalendarMonth";

export default function CourseDetails() {
  const context = useCourseContext();

  const startDate = getDateFromStringOrThrow(
    context.localCourse.settings.startDate,
    "course start date"
  );
  const endDate = getDateFromStringOrThrow(
    context.localCourse.settings.endDate,
    "course end date"
  );

  const months = getMonthsBetweenDates(startDate, endDate);
  return (
    <div>
      {context.localCourse.settings.name}
      <div className="flex flex-row">
        <div className="grow">
          {months.map((month) => (
            <CalendarMonth
              key={month.month + "" + month.year}
              month={month}
              localCourse={context.localCourse}
            />
          ))}
        </div>
        <div className="w-96">
          <details>
            <summary role="button">first module</summary>
            <div>here are the module items</div>
          </details>
        </div>
      </div>
    </div>
  );
}
