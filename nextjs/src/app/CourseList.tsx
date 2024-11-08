"use client";
import { useLocalCoursesSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";

export default function CourseList() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();

  return (
    <div>
      {allSettings.map((settings) => (
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
  );
}
