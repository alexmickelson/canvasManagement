import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { getDateFromString } from "@/features/local/utils/timeUtils";
import { getLectureWeekName } from "@/features/local/lectures/lectureUtils";
import { getCourseUrl, getLecturePreviewUrl } from "@/services/urlUtils";
import { useCourseContext } from "../../context/courseContext";
import Link from "next/link";
import { getDayOfWeek } from "@/features/local/course/localCourseSettings";

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
          shallow={true}
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
          shallow={true}
        >
          preview
        </Link>
      </div>
    </div>
  );
}
