import { createFileRoute } from "@tanstack/react-router";
import LecturePreviewPage from "@/app/course/[courseName]/lecture/[lectureDay]/preview/LecturePreviewPage";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";

export const Route = createFileRoute(
  "/course/$courseName/lecture/$lectureDay/preview",
)({
  component: LecturePreview,
});

function LecturePreview() {
  const { lectureDay } = Route.useParams();
  const decodedLectureDay = decodeURIComponent(lectureDay);
  const lectureDate = getDateFromStringOrThrow(
    decodedLectureDay,
    "lecture day in lecture page",
  );
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate);
  return <LecturePreviewPage lectureDay={lectureDayOnly} />;
}
