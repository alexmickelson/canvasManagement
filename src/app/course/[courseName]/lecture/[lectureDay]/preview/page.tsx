import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";
import LecturePreviewPage from "./LecturePreviewPage";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ lectureDay: string }>;
}) {
  const { lectureDay } = await params;
  const decodedLectureDay = decodeURIComponent(lectureDay);
  const lectureDate = getDateFromStringOrThrow(
    decodedLectureDay,
    "lecture day in lecture page"
  );
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate);
  console.log(lectureDayOnly);

  return (
    <>
      <LecturePreviewPage lectureDay={lectureDayOnly} />
    </>
  );
}
