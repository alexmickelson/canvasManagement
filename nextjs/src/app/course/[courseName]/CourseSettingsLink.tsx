"use client";

import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import Link from "next/link";
import { useCourseContext } from "./context/courseContext";
import { getCourseSettingsUrl } from "@/services/urlUtils";

export default function CourseSettingsLink() {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <div>
      {settings.name}

      <Link className="mx-3 underline" href={getCourseSettingsUrl(courseName)} shallow={true}>
        Course Settings
      </Link>
    </div>
  );
}
