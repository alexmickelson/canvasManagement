"use client";
import { useLocalCourseDetailsQuery } from "@/hooks/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";

export default function Page({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const { data: course } = useLocalCourseDetailsQuery(courseName);

  const startDate = getDateFromStringOrThrow(course.settings.startDate);
  const endDate = getDateFromStringOrThrow(course.settings.endDate);

  const months = getMonthsBetweenDates(startDate, endDate);
  return (
    <div>
      {course.settings.name}
      <div>
        {months.map((month) => (
          <CalendarMonth key={month.month + "" + month.year} month={month} localCourse={course} />
        ))}
      </div>
    </div>
  );
}
