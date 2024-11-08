"use client";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import Link from "next/link";

export function CourseNavigation() {
  const [settings] = useLocalCourseSettingsQuery();
  return (
    <div className="pb-1 ps-5 flex flex-row gap-3">
      <Link href={"/"} className="btn">
        Back to Course List
      </Link>
      <a
        href={`https://snow.instructure.com/courses/${settings.canvasId}`}
        className="btn"
        target="_blank"
      >
        View in Canvas
      </a>
    </div>
  );
}
