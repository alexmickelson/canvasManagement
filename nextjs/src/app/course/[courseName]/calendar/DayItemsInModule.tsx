"use client";
import React, { useCallback, useMemo } from "react";
import { useCourseContext } from "../context/courseContext";
import { useModuleDataQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import Link from "next/link";
import { LocalAssignment } from "@/models/local/assignmnet/localAssignment";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";

export default function DayItemsInModule({
  day,
  moduleName,
}: {
  day: Date;
  moduleName: string;
}) {
  const { courseName, endItemDrag, startItemDrag } = useCourseContext();
  const { assignments, quizzes, pages } = useModuleDataQuery(
    courseName,
    moduleName
  );

  const todaysAssignments = useMemo(
    () =>
      assignments.filter((a) => {
        const dueDate = getDateFromStringOrThrow(
          a.dueAt,
          "due at for assignment in day"
        );
        return (
          dueDate.getFullYear() === day.getFullYear() &&
          dueDate.getMonth() === day.getMonth() &&
          dueDate.getDate() === day.getDate()
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
        return (
          dueDate.getFullYear() === day.getFullYear() &&
          dueDate.getMonth() === day.getMonth() &&
          dueDate.getDate() === day.getDate()
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
        return (
          dueDate.getFullYear() === day.getFullYear() &&
          dueDate.getMonth() === day.getMonth() &&
          dueDate.getDate() === day.getDate()
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
          >
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
