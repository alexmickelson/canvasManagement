"use client";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "../context/courseContext";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useMemo } from "react";

export default function CourseCalendar() {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery(courseName);

  const startDateTime = useMemo(
    () => getDateFromStringOrThrow(settings.startDate, "course start date"),
    [settings.startDate]
  );
  const endDateTime = useMemo(
    () => getDateFromStringOrThrow(settings.endDate, "course end date"),
    [settings.endDate]
  );
  const months = useMemo(
    () => getMonthsBetweenDates(startDateTime, endDateTime),
    [endDateTime, startDateTime]
  );

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
