import React from "react";
import EditLecture from "./EditLecture";
import { getDateFromStringOrThrow, getDateOnlyMarkdownString } from "@/models/local/timeUtils";

export default function page({
  params: { lectureDay },
}: {
  params: { lectureDay: string };
}) {
  const decodedLectureDay = decodeURIComponent(lectureDay);
  console.log(decodedLectureDay);
  const lectureDate = getDateFromStringOrThrow(decodedLectureDay, "lecture day in lecture page")
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate)
  return <EditLecture lectureDay={lectureDayOnly} />;
}
