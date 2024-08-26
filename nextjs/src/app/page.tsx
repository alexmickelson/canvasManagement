"use client"
import { useLocalCoursesQuery } from "@/hooks/localCoursesHooks";
import Link from "next/link";

export default function Home() {
  const { data: courses } = useLocalCoursesQuery();
  return (
    <main className="min-h-screen">
      {courses.map((c) => (
        <Link href={`/course/${c.settings.name}`} key={c.settings.name}>{c.settings.name} </Link>
      ))}
    </main>
  );
}
