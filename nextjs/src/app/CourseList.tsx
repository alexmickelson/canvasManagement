"use client";
import { useLocalCoursesSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { trpc } from "@/services/trpc/utils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useEffect } from "react";

export default function CourseList() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();

  const {data} = trpc.sayHello.useQuery()

console.log(data);
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
