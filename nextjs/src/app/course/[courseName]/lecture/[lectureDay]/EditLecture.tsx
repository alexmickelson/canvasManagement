"use client";

import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useLecturesByWeekQuery,
  useLectureUpdateMutation,
} from "@/hooks/localCourse/lectureHooks";
import { Lecture } from "@/models/local/lecture";
import {
  lectureToString,
  parseLecture,
} from "@/services/fileStorage/utils/lectureUtils";
import { useEffect, useState } from "react";
import LecturePreview from "./LecturePreview";

export default function EditLecture({ lectureDay }: { lectureDay: string }) {
  const { data: weeks } = useLecturesByWeekQuery();
  const updateLecture = useLectureUpdateMutation();
  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  const startingText = lecture ? lectureToString(lecture) : `Name: Name Here
Date: ${lectureDay}
---
`;

  const [text, setText] = useState(startingText);
  const [error, setError] = useState("");

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      try {
        const parsed = parseLecture(text);
        if (!lecture || lectureToString(parsed) !== lectureToString(lecture)) {
          console.log("updating lecture");
          updateLecture.mutate(parsed);
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [lecture, text, updateLecture]);

  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={text} onChange={setText} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          {lecture && <LecturePreview lecture={lecture} />}
        </div>
      </div>
    </div>
  );
}
