import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import LecturePreviewPage from "./LecturePreviewPage";

export default function Page({
  params: { lectureDay },
}: {
  params: { lectureDay: string };
}) {
  const decodedLectureDay = decodeURIComponent(lectureDay);
  console.log(decodedLectureDay);
  const lectureDate = getDateFromStringOrThrow(
    decodedLectureDay,
    "lecture day in lecture page"
  );
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate);

  return <LecturePreviewPage lectureDay={lectureDayOnly} />;
}
