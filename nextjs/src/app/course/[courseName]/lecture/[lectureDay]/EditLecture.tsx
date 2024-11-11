"use client";

import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useLectureUpdateMutation } from "@/hooks/localCourse/lectureHooks";
import {
  lectureToString,
  parseLecture,
} from "@/services/fileStorage/utils/lectureUtils";
import { useEffect, useState } from "react";
import LecturePreview from "./LecturePreview";
import EditLectureTitle from "./EditLectureTitle";
import LectureButtons from "./LectureButtons";
import { trpc } from "@/services/trpc/utils";
import { useCourseContext } from "../../context/courseContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";

export default function EditLecture({ lectureDay }: { lectureDay: string }) {
  const { courseName } = useCourseContext();
  const [settings] = useLocalCourseSettingsQuery();
  const [weeks] = trpc.lectures.getLectures.useSuspenseQuery({ courseName });
  const updateLecture = useLectureUpdateMutation();

  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  const startingText = lecture
    ? lectureToString(lecture)
    : `Name: 
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
          updateLecture.mutate({ lecture: parsed, settings, courseName });
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [courseName, lecture, settings, text, updateLecture]);

  return (
    <div className="h-full flex flex-col">
      <EditLectureTitle lectureDay={lectureDay} />
      <div className="sm:columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={text} onChange={setText} />
        </div>
        <div className="h-full sm:block none overflow-auto">
          <div className="text-red-300">{error && error}</div>
          {lecture && <LecturePreview lecture={lecture} />}
        </div>
      </div>
      <LectureButtons lectureDay={lectureDay} />
    </div>
  );
}
