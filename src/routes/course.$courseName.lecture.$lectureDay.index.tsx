import { createFileRoute } from "@tanstack/react-router";
import EditLecture from "@/app/course/[courseName]/lecture/[lectureDay]/EditLecture";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";

export const Route = createFileRoute(
  "/course/$courseName/lecture/$lectureDay/",
)({
  component: LecturePage,
});

function LecturePage() {
  const { lectureDay } = Route.useParams();
  const decodedLectureDay = decodeURIComponent(lectureDay);
  const lectureDate = getDateFromStringOrThrow(
    decodedLectureDay,
    "lecture day in lecture page",
  );
  const lectureDayOnly = getDateOnlyMarkdownString(lectureDate);
  return <EditLecture lectureDay={lectureDayOnly} />;
}
