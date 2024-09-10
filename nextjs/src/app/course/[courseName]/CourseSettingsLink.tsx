"use client";

import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import Link from "next/link";
import { useCourseContext } from "./context/courseContext";

export default function CourseSettingsLink() {
  const {courseName} = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <div>
      {settings.name}

      <Link
        href={
          "/course/" +
          encodeURIComponent(courseName) +
          "/settings"
        }
        shallow={true}
      >
        Course Settings
      </Link>
    </div>
  );
}
