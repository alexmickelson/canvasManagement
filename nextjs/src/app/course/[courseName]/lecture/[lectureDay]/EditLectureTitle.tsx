import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDayOfWeek } from "@/models/local/localCourse";
import { getDateFromString } from "@/models/local/timeUtils";
import { getLectureWeekName } from "@/services/fileStorage/utils/lectureUtils";
import { getCourseUrl, getLecturePreviewUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import { useCourseContext } from "../../context/courseContext";
import Link from "next/link";

export default function EditLectureTitle({
  lectureDay,
}: {
  lectureDay: string;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  const lectureDate = getDateFromString(lectureDay);
  const lectureWeekName = getLectureWeekName(settings.startDate, lectureDay);
  return (
    <div className="flex justify-between sm:flex-row flex-col">
      <div className="my-auto">
        <Link
          className="btn hidden sm:inline"
          href={getCourseUrl(courseName)}
        >
          {courseName}
        </Link>
      </div>
      <div className="flex justify-center  ">
        <h3 className="mt-auto me-3 text-slate-500 ">Lecture</h3>
        <h1 className="">
          {lectureDate && getDayOfWeek(lectureDate)}{" "}
          {lectureWeekName.toUpperCase()}
        </h1>
      </div>
      <div className="text-end my-auto flex">
        <Link
          className="btn inline text-center flex-grow m-1"
          href={getLecturePreviewUrl(courseName, lectureDay)}
        >
          preview
        </Link>
      </div>
    </div>
  );
}
