"use client";
import { useLocalCoursesSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";

function getDateKey(dateString: string) {
  return dateString.split("T")[0];
}
function groupByStartDate(courses: LocalCourseSettings[]): {
  [key: string]: LocalCourseSettings[];
} {
  return courses.reduce(
    (acc, course) => {
      const { startDate } = course;
      const key = getDateKey(startDate);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(course);
      return acc;
    },
    {} as {
      [key: string]: LocalCourseSettings[];
    }
  );
}

function getTermName(startDate: string) {
  const [year, month, ..._rest] = startDate.split("-");
  if (month < "04") return "Spring " + year;
  if (month < "07") return "Summer " + year;
  return "Fall " + year;
}

export default function CourseList() {
  const [allSettings] = useLocalCoursesSettingsQuery();

  const coursesByStartDate = groupByStartDate(allSettings);

  const sortedDates = Object.keys(coursesByStartDate).sort()

  return (
    <div className="flex flex-row ">
      {sortedDates.map((startDate) => (
        <div
          key={startDate}
          className=" border-4 border-slate-800 rounded p-3 m-3"
        >
          <div className="text-center">{getTermName(startDate)}</div>
          {coursesByStartDate[getDateKey(startDate)].map((settings) => (
            <div key={settings.name}>
              <Link
                href={getCourseUrl(settings.name)}
                shallow={true}
                className="
              font-bold text-xl block
              transition-all hover:scale-105 hover:underline hover:text-slate-200
              mb-3
            "
              >
                {settings.name}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}