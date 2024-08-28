"use client";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "../context/courseContext";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";

export default function CourseCalendar() {
  const {
    localCourse: {
      settings: { startDate, endDate },
    },
  } = useCourseContext();

  const startDateTime = getDateFromStringOrThrow(
    startDate,
    "course start date"
  );
  const endDateTime = getDateFromStringOrThrow(endDate, "course end date");
  const months = getMonthsBetweenDates(startDateTime, endDateTime);

  return (
    <div
      className="
        h-full 
        overflow-y-scroll 
        border-4 
        border-slate-600 
        rounded-xl 
        bg-slate-950
      "
    >
      {months.map((month) => (
        <CalendarMonth key={month.month + "" + month.year} month={month} />
      ))}
    </div>
  );
}
