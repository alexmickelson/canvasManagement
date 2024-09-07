"use client";
import { useLocalCourseNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
import Link from "next/link";

export default function CourseList() {
  const { data: courses } = useLocalCourseNamesQuery();
  console.log(courses);
  return (
    <div>
      {courses.map((c) => (
        <Link href={`/course/${c}`} key={c} shallow={true}>
          {c}{" "}
        </Link>
      ))}
    </div>
  );
}
