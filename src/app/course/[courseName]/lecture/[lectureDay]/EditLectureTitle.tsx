import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { getDateFromString } from "@/features/local/utils/timeUtils";
import { getLectureWeekName } from "@/features/local/lectures/lectureUtils";
import { getDayOfWeek } from "@/features/local/course/localCourseSettings";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function EditLectureTitle({
  lectureDay,
}: {
  lectureDay: string;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const lectureDate = getDateFromString(lectureDay);
  const lectureWeekName = getLectureWeekName(settings.startDate, lectureDay);
  return (
    <div className="flex justify-between items-center min-w-0 gap-2">
      <BreadCrumbs />
      <div className="flex justify-center min-w-0">
        <h3 className="mt-auto me-3 text-slate-500 max-md:hidden">Lecture</h3>
        <h1 className="max-md:text-lg truncate">
          {lectureDate && getDayOfWeek(lectureDate)}{" "}
          {lectureWeekName.toUpperCase()}
        </h1>
      </div>
    </div>
  );
}
