"use client";

import LecturePreview from "../LecturePreview";
import { getCourseUrl, getLectureUrl } from "@/services/urlUtils";
import { useCourseContext } from "../../../context/courseContext";
import Link from "next/link";
import { useLecturesSuspenseQuery } from "@/hooks/localCourse/lectureHooks";

export default function LecturePreviewPage({
  lectureDay,
}: {
  lectureDay: string;
}) {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesSuspenseQuery();
  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  if (!lecture) {
    return <div>lecture not found for day</div>;
  }
  return (
    <div className="flex h-full xl:flex-row flex-col ">
      <div className="flex-shrink flex-1 pb-1 ms-3 xl:ms-0 flex flex-row flex-wrap gap-3 content-start ">
        <div className="">
          <Link
            className="btn"
            href={getLectureUrl(courseName, lectureDay)}
            shallow={true}
          >
            Edit Lecture
          </Link>
        </div>
        <div className="">
          <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
            Course Calendar
          </Link>
        </div>
      </div>
      <div className="flex  justify-center min-h-0 px-2">
        <div
          className="
            w-full max-w-screen-lg 
            border-slate-700 border-4 rounded-md bg-gray-900/50
            p-3 overflow-auto 
          "
        >
          <LecturePreview lecture={lecture} />
        </div>
      </div>
      <div className="flex-shrink flex-1"></div>
    </div>
  );
}
