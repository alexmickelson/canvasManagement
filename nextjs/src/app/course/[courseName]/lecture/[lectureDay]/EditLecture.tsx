"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useLecturesSuspenseQuery,
  useLectureUpdateMutation,
} from "@/hooks/localCourse/lectureHooks";
import {
  lectureToString,
  parseLecture,
} from "@/services/fileStorage/utils/lectureUtils";
import { useCallback, useEffect, useState } from "react";
import LecturePreview from "./LecturePreview";
import EditLectureTitle from "./EditLectureTitle";
import LectureButtons from "./LectureButtons";
import { useCourseContext } from "../../context/courseContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { Lecture } from "@/models/local/lecture";

export default function EditLecture({ lectureDay }: { lectureDay: string }) {
  const { courseName } = useCourseContext();
  const [settings] = useLocalCourseSettingsQuery();
  const [weeks, { dataUpdatedAt: serverDataUpdatedAt }] =
    useLecturesSuspenseQuery();
  const updateLecture = useLectureUpdateMutation();

  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  const startingText = getLectureTextOrDefault(lecture, lectureDay);

  const [text, setText] = useState(startingText);
  const [updateMonacoKey, setUpdateMonacoKey] = useState(1);
  const [error, setError] = useState("");

  const [clientDataUpdatedAt, setClientDataUpdatedAt] =
    useState(serverDataUpdatedAt);

  const textUpdate = useCallback((t: string) => {
    setText(t);
    setClientDataUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    const delay = 500;
    const clientIsAuthoritative = serverDataUpdatedAt <= clientDataUpdatedAt;
    console.log("client is authoritative", clientIsAuthoritative);

    const handler = setTimeout(() => {
      try {
        const parsed = parseLecture(text);
        if (!lecture || lectureToString(parsed) !== lectureToString(lecture)) {
          if (clientIsAuthoritative) {
            console.log("updating lecture");
            updateLecture.mutate({ lecture: parsed, settings, courseName });
          } else {
            if (lecture) {
              console.log(
                "client not authoritative, updating client with server data"
              );
              textUpdate(lectureToString(lecture));
              setUpdateMonacoKey((k) => k + 1);
            } else {
              console.log(
                "client not authoritative, but no lecture on server, this is a bug"
              );
            }
          }
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [courseName, lecture, settings, text, textUpdate, updateLecture]);

  return (
    <div className="h-full flex flex-col">
      <EditLectureTitle lectureDay={lectureDay} />
      <div className="sm:columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor
            key={updateMonacoKey}
            value={text}
            onChange={textUpdate}
          />
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

function getLectureTextOrDefault(
  lecture: Lecture | undefined,
  lectureDay: string
) {
  return lecture
    ? lectureToString(lecture)
    : `Name: 
Date: ${lectureDay}
---
`;
}
