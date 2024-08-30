import React from "react";
import { useCourseContext } from "../context/courseContext";
import { useModuleDataQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";

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

  const todaysAssignments = assignments.filter((a) => {
    const dueDate = getDateFromStringOrThrow(
      a.dueAt,
      "due at for assignment in day"
    );
    return (
      dueDate.getFullYear() === day.getFullYear() &&
      dueDate.getMonth() === day.getMonth() &&
      dueDate.getDate() === day.getDate()
    );
  });
  const todaysQuizzes = quizzes.filter((q) => {
    const dueDate = getDateFromStringOrThrow(q.dueAt, "due at for quiz in day");
    return (
      dueDate.getFullYear() === day.getFullYear() &&
      dueDate.getMonth() === day.getMonth() &&
      dueDate.getDate() === day.getDate()
    );
  });
  const todaysPages = pages.filter((p) => {
    const dueDate = getDateFromStringOrThrow(p.dueAt, "due at for page in day");
    return (
      dueDate.getFullYear() === day.getFullYear() &&
      dueDate.getMonth() === day.getMonth() &&
      dueDate.getDate() === day.getDate()
    );
  });
  return (
    <>
      <ul className="list-disc ms-4">
        {todaysAssignments.map((a) => (
          <li key={a.name}>{a.name}</li>
        ))}
        {todaysQuizzes.map((q) => (
          <li
            key={q.name}
            role="button"
            draggable="true"
            onDragStart={() =>
              startItemDrag({
                type: "quiz",
                item: q,
                sourceModuleName: moduleName,
              })
            }
            onDragEnd={endItemDrag}
          >
            {q.name}
          </li>
        ))}
        {todaysPages.map((p) => (
          <li
            key={p.name}
            role="button"
            draggable="true"
            onDragStart={() =>
              startItemDrag({
                type: "page",
                item: p,
                sourceModuleName: moduleName,
              })
            }
          >
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
