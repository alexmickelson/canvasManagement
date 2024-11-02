"use client";

import { useLecturesByWeekQuery } from "@/hooks/localCourse/lectureHooks";
import { getDateOnlyMarkdownString } from "@/models/local/timeUtils";
import { getLecturePreviewUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "../course/[courseName]/context/courseContext";

export default function OneCourseLectures() {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesByWeekQuery();

  const dayAsDate = new Date();
  const dayAsString = getDateOnlyMarkdownString(dayAsDate);
  const todaysLecture = weeks
    .flatMap((w) => w.lectures)
    .find((l) => l.date == dayAsString);
  if (!todaysLecture) return <></>;
  return (
    <Link
      href={getLecturePreviewUrl(courseName, dayAsString)}
      className="
        border-4 rounded-lg border-slate-500 
        p-3 m-3 block text-end
        bg-slate-950
        transition-all hover:scale-110 hover:shadow-md
      "
    >
      <span className="font-bold text-xl">{todaysLecture?.name}</span>
      <br />
      <span className="text-slate-500">{courseName}</span>
    </Link>
  );
}
