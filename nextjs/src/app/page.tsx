"use client"
import { useLocalCoursesQuery } from "@/hooks/localCoursesHooks";

export default function Home() {
  const { data: courses } = useLocalCoursesQuery();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {courses.map((c) => (
        <div key={c.settings.name}>{c.settings.name} </div>
      ))}
    </main>
  );
}
