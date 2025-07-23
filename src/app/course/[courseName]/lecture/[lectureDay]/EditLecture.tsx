"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useLecturesSuspenseQuery,
  useLectureUpdateMutation,
} from "@/features/local/lectures/lectureHooks";
import {
  lectureToString,
  parseLecture,
} from "@/features/local/lectures/lectureUtils";
import { useEffect, useState } from "react";
import LecturePreview from "./LecturePreview";
import EditLectureTitle from "./EditLectureTitle";
import LectureButtons from "./LectureButtons";
import { useCourseContext } from "../../context/courseContext";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { Lecture } from "@/features/local/lectures/lectureModel";
import { useAuthoritativeUpdates } from "../../utils/useAuthoritativeUpdates";
import { EditLayout } from "@/components/EditLayout";

export default function EditLecture({ lectureDay }: { lectureDay: string }) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const {
    data: weeks,
    dataUpdatedAt: serverDataUpdatedAt,
    isFetching,
  } = useLecturesSuspenseQuery();
  const updateLecture = useLectureUpdateMutation();

  const lecture = weeks
    .flatMap(({ lectures }) => lectures.map((lecture) => lecture))
    .find((l) => l.date === lectureDay);

  const { clientIsAuthoritative, text, textUpdate, monacoKey } =
    useAuthoritativeUpdates({
      serverUpdatedAt: serverDataUpdatedAt,
      startingText: getLectureTextOrDefault(lecture, lectureDay),
    });
  const [error, setError] = useState("");

  useEffect(() => {
    const delay = 500;

    const handler = setTimeout(() => {
      try {
        if (isFetching || updateLecture.isPending) {
          console.log("network requests in progress, not updating page");
          return;
        }
        const parsed = parseLecture(text);
        if (!lecture || lectureToString(parsed) !== lectureToString(lecture)) {
          if (clientIsAuthoritative) {
            console.log("updating lecture");
            updateLecture.mutate({ lecture: parsed, settings, courseName });
          } else {
            if (lecture) {
              console.log(
                "client not authoritative, updating client with server lecture"
              );
              textUpdate(lectureToString(lecture), true);
            } else {
              console.log(
                "client not authoritative, but no lecture on server, this is a bug"
              );
            }
          }
        }
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [
    clientIsAuthoritative,
    courseName,
    isFetching,
    lecture,
    settings,
    text,
    textUpdate,
    updateLecture,
  ]);
  return (
    <EditLayout
      Header={<EditLectureTitle lectureDay={lectureDay} />}
      Body={
        <div className="sm:columns-2 min-h-0 flex-1">
          <div className="flex-1 h-full">
            <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
          </div>
          <div className="h-full sm:block none overflow-auto">
            <div className="text-red-300">{error && error}</div>
            {lecture && <LecturePreview lecture={lecture} />}
          </div>
        </div>
      }
      Footer={<LectureButtons lectureDay={lectureDay} />}
    />
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
