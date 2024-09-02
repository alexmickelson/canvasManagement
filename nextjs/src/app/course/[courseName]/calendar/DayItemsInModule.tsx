"use client";
import React, { useMemo } from "react";
import { useCourseContext } from "../context/courseContext";
import { useModuleDataQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import Link from "next/link";
import { usePageNamesQuery, usePagesQueries } from "@/hooks/localCourse/pageHooks";
import { useQuizNamesQuery, useQuizzesQueries } from "@/hooks/localCourse/quizHooks";
import { useAssignmentNamesQuery, useAssignmentsQueries } from "@/hooks/localCourse/assignmentHooks";

export default function DayItemsInModule({
  day,
  moduleName,
}: {
  day: string;
  moduleName: string;
}) {
  return (
    <ul className="list-disc ms-4">
      <Assignments moduleName={moduleName} day={day} />
      <Quizzes moduleName={moduleName} day={day} />
      <Pages moduleName={moduleName} day={day} />
    </ul>
  );
}

function Pages({ moduleName, day }: { moduleName: string; day: string }) {
  const { data: pageNames } = usePageNamesQuery(moduleName);
  const { data: pages } = usePagesQueries(moduleName, pageNames);
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
  return (
    <>
      {todaysPages.map((p) => (
        <li
          key={p.name}
          role="button"
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "draggableItem",
              JSON.stringify({
                type: "page",
                item: p,
                sourceModuleName: moduleName,
              })
            );
          }}
        >
          {p.name}
        </li>
      ))}
    </>
  );
}

function Quizzes({ moduleName, day }: { moduleName: string; day: string }) {
  const { data: quizNames } = useQuizNamesQuery(moduleName);
  const { data: quizzes } = useQuizzesQueries(moduleName, quizNames);
  
  const { courseName } = useCourseContext();
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
  return (
    <>
      {todaysQuizzes.map((q) => (
        <li
          key={q.name}
          role="button"
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "draggableItem",
              JSON.stringify({
                type: "quiz",
                item: q,
                sourceModuleName: moduleName,
              })
            );
          }}
          onDragEnd={(e) => e.preventDefault()}
        >
          <Link
            href={`/course/${courseName}/modules/${moduleName}/quiz/${q.name}`}
          >
            {q.name}
          </Link>
        </li>
      ))}
    </>
  );
}

function Assignments({ moduleName, day }: { moduleName: string; day: string }) {
  const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
  const { data: assignments } = useAssignmentsQueries(
    moduleName,
    assignmentNames
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
  return (
    <>
      {todaysAssignments.map((a) => (
        <li
          key={a.name}
          role="button"
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "draggableItem",
              JSON.stringify({
                type: "assignment",
                item: a,
                sourceModuleName: moduleName,
              })
            );
          }}
        >
          {a.name}
        </li>
      ))}
    </>
  );
}
