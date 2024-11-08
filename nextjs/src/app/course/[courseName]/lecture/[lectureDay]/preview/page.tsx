import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import LecturePreviewPage from "./LecturePreviewPage";

export default async function Page({
  params,
}: {
  params: Promise<{ lectureDay: string }>;
}) {
  const { lectureDay } = await params;
  const decodedLectureDay = decodeURIComponent(lectureDay);
  console.log(decodedLectureDay);
  const lectureDate = getDateFromStringOrThrow(
    decodedLectureDay,
    "lecture day in lecture page"
  );
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate);

  return <LecturePreviewPage lectureDay={lectureDayOnly} />;
}
