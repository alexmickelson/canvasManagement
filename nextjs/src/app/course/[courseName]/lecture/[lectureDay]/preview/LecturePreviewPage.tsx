"use client";

import { useLecturesByWeekQuery } from "@/hooks/localCourse/lectureHooks";
import LecturePreview from "../LecturePreview";
import { getLectureUrl } from "@/services/urlUtils";
import { useCourseContext } from "../../../context/courseContext";
import Link from "next/link";

export default function LecturePreviewPage({
  lectureDay,
}: {
  lectureDay: string;
}) {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesByWeekQuery();
  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  if (!lecture) {
    return <div>lecture not found for day</div>;
  }
  return (
    <div className="flex h-full xl:flex-row flex-col ">
      <div className="flex-shrink flex-1 pb-1 ms-3 xl:ms-0">
        <Link className="btn" href={getLectureUrl(courseName, lectureDay)}>
          Edit Page
        </Link>
      </div>
      <div className="flex  justify-center min-h-0 px-2">
        <div
          className="
          w-full max-w-screen-lg 
          border-slate-700 border-4 rounded-md
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
