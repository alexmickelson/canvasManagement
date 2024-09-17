import React from "react";
import EditLecture from "./EditLecture";

export default function page({
  params: { lectureDay },
}: {
  params: { lectureDay: string };
}) {
  const decodedLectureDay = decodeURIComponent(lectureDay);
  console.log(decodedLectureDay);
  return <EditLecture lectureDay={decodedLectureDay} />;
}
