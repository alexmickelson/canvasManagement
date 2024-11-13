"use client";

import { getDateOnlyMarkdownString } from "@/models/local/timeUtils";
import { getLecturePreviewUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "../course/[courseName]/context/courseContext";
import { getLectureForDay } from "@/models/local/lectureUtils";
import { useLecturesSuspenseQuery as useLecturesQuery } from "@/hooks/localCourse/lectureHooks";

export default function OneCourseLectures() {
  const { courseName } = useCourseContext();
  const [weeks] = useLecturesQuery();

  const dayAsDate = new Date();
  const dayAsString = getDateOnlyMarkdownString(dayAsDate);
  const todaysLecture = getLectureForDay(weeks, dayAsDate);

  if (!todaysLecture) return <></>;
  return (
    <Link
      href={getLecturePreviewUrl(courseName, dayAsString)}
      className="
        border-4 rounded-lg border-slate-500 
        px-3 py-1 m-3 block text-end
        bg-slate-950
        transition-all hover:scale-110 hover:shadow-md
      "
    >
      <span className="text-end text-slate-500">lecture</span>
      <br />
      <span className="font-bold text-xl">{todaysLecture?.name}</span>
      <br />
      <span className="text-slate-500">{courseName}</span>
    </Link>
  );
}
