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
          <Link href={getCourseUrl(settings.name)} shallow={true}>
            {settings.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
