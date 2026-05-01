"use client";

import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { Link } from "@tanstack/react-router";
import { useCourseContext } from "./context/courseContext";
import { getCourseSettingsUrl } from "@/services/urlUtils";

export default function CourseSettingsLink() {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <div>
      {settings.name}

      <Link className="mx-3 underline" to={getCourseSettingsUrl(courseName)}>
        Course Settings
      </Link>
    </div>
  );
}
