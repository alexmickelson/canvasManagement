"use client";
import { useLocalCourseNamesQuery } from "@/hooks/localCoursesHooks";
import Link from "next/link";

export default function CourseList() {
  const { data: courses } = useLocalCourseNamesQuery();
  return (
    <div>
      {courses.map((c) => (
        <Link href={`/course/${c.settings.name}`} key={c.settings.name}>
          {c.settings.name}{" "}
        </Link>
      ))}
    </div>
  );
}