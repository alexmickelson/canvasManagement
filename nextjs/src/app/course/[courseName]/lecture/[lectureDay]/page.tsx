import EditLecture from "./EditLecture";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/utils/timeUtils";
export const dynamic = "force-dynamic";

export default async function page({
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
  return <EditLecture lectureDay={lectureDayOnly} />;
}
