"use client";
import { useLocalCoursesSettingsQuery } from "@/features/local/course/localCoursesHooks";
import {
  getDateKey,
  getTermName,
  groupByStartDate,
} from "@/features/local/utils/timeUtils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";

export default function CourseList() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();

  const coursesByStartDate = groupByStartDate(allSettings);

  const sortedDates = Object.keys(coursesByStartDate).sort();

  console.log(allSettings, coursesByStartDate);

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
