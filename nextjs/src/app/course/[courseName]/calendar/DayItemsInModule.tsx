"use client";
import React, { useCallback, useMemo } from "react";
import { useCourseContext } from "../context/courseContext";
import { useModuleDataQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import Link from "next/link";
import { LocalAssignment } from "@/models/local/assignmnet/localAssignment";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useDraggingContext } from "../context/DraggingContext";

export default function DayItemsInModule({
  day,
  moduleName,
}: {
  day: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const { endItemDrag, startItemDrag } = useDraggingContext();
  const { assignments, quizzes, pages } = useModuleDataQuery(
    moduleName
  );
  const todaysAssignments = useMemo(
    () =>
      assignments.filter((a) => {
        const dueDate = getDateFromStringOrThrow(
          a.dueAt,
          "due at for assignment in day"
        );
        const dayAsDate = getDateFromStringOrThrow(
          day,
          "in assignment in DayItemsInModule"
        );
        return (
          dueDate.getFullYear() === dayAsDate.getFullYear() &&
          dueDate.getMonth() === dayAsDate.getMonth() &&
          dueDate.getDate() === dayAsDate.getDate()
        );
      }),
    [assignments, day]
  );
  const todaysQuizzes = useMemo(
    () =>
      quizzes.filter((q) => {
        const dueDate = getDateFromStringOrThrow(
          q.dueAt,
          "due at for quiz in day"
        );
        const dayAsDate = getDateFromStringOrThrow(
          day,
          "in quizzes in DayItemsInModule"
        );
        return (
          dueDate.getFullYear() === dayAsDate.getFullYear() &&
          dueDate.getMonth() === dayAsDate.getMonth() &&
          dueDate.getDate() === dayAsDate.getDate()
        );
      }),
    [day, quizzes]
  );
  const todaysPages = useMemo(
    () =>
      pages.filter((p) => {
        const dueDate = getDateFromStringOrThrow(
          p.dueAt,
          "due at for page in day"
        );
        const dayAsDate = getDateFromStringOrThrow(
          day,
          "in pages in DayItemsInModule"
        );
        return (
          dueDate.getFullYear() === dayAsDate.getFullYear() &&
          dueDate.getMonth() === dayAsDate.getMonth() &&
          dueDate.getDate() === dayAsDate.getDate()
        );
      }),
    [day, pages]
  );
  const startAssignmentDrag = useCallback(
    (a: LocalAssignment) => () =>
      startItemDrag({
        type: "assignment",
        item: a,
        sourceModuleName: moduleName,
      }),
    [moduleName, startItemDrag]
  );
  const startQuizDrag = useCallback(
    (q: LocalQuiz) => () =>
      startItemDrag({
        type: "quiz",
        item: q,
        sourceModuleName: moduleName,
      }),
    [moduleName, startItemDrag]
  );
  const starPageDrag = useCallback(
    (p: LocalCoursePage) => () =>
      startItemDrag({
        type: "page",
        item: p,
        sourceModuleName: moduleName,
      }),
    [moduleName, startItemDrag]
  );
  return (
    <>
      <ul className="list-disc ms-4">
        {todaysAssignments.map((a) => (
          <li
            key={a.name}
            role="button"
            draggable="true"
            onDragStart={startAssignmentDrag(a)}
            onDragEnd={endItemDrag}
          >
            {a.name}
          </li>
        ))}
        {todaysQuizzes.map((q) => (
          <li
            key={q.name}
            role="button"
            draggable="true"
            onDragStart={startQuizDrag(q)}
            onDragEnd={endItemDrag}
          >
            <Link
              href={`/course/${courseName}/modules/${moduleName}/quiz/${q.name}`}
            >
              {q.name}
            </Link>
          </li>
        ))}
        {todaysPages.map((p) => (
          <li
            key={p.name}
            role="button"
            draggable="true"
            onDragStart={starPageDrag(p)}
            onDragEnd={endItemDrag}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
