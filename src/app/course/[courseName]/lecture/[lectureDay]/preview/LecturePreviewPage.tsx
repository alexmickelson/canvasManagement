"use client";

import LecturePreview from "../LecturePreview";
import { useLecturesSuspenseQuery } from "@/features/local/lectures/lectureHooks";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function LecturePreviewPage({
  lectureDay,
}: {
  lectureDay: string;
}) {
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
        <BreadCrumbs />
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
