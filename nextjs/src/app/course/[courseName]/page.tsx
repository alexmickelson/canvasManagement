"use client";
import { useLocalCourseDetailsQuery } from "@/hooks/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";

export default function Page({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const { data: course } = useLocalCourseDetailsQuery(courseName);
  console.log(course);

  const startDate = getDateFromStringOrThrow(course.settings.startDate);
  const endDate = getDateFromStringOrThrow(course.settings.endDate);

  const months = calendarMonthUtils.getMonthsBetweenDates(startDate, endDate);
  return (
    <div>
      {course.settings.name}
      <div>
        {months.map((month) => (
          <div key={month.month + "" + month.year}>{month.month}</div>
        ))}
      </div>
    </div>
  );
}
