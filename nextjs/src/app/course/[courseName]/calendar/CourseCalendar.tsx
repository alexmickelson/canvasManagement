"use client";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "../context/courseContext";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";

export default function CourseCalendar() {
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
    <>
      {months.map((month) => (
        <CalendarMonth
          key={month.month + "" + month.year}
          month={month}
          localCourse={context.localCourse}
        />
      ))}
    </>
  );
}
