"use client";

import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "../context/courseContext";

export default function Day({ day, month }: { day: Date; month: number }) {
  const {
    localCourse: { modules },
    startItemDrag,
    endItemDrag,
    itemDrop,
  } = useCourseContext();

  const isInSameMonth = day.getMonth() + 1 != month;
  const backgroundClass = isInSameMonth ? "" : "bg-slate-900";

  const todaysAssignments = modules
    .flatMap((m) => m.assignments)
    .filter((a) => {
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
  const todaysQuizzes = modules
    .flatMap((m) => m.quizzes)
    .filter((q) => {
      const dueDate = getDateFromStringOrThrow(
        q.dueAt,
        "due at for quiz in day"
      );
      return (
        dueDate.getFullYear() === day.getFullYear() &&
        dueDate.getMonth() === day.getMonth() &&
        dueDate.getDate() === day.getDate()
      );
    });
  const todaysPages = modules
    .flatMap((m) => m.pages)
    .filter((p) => {
      const dueDate = getDateFromStringOrThrow(
        p.dueAt,
        "due at for page in day"
      );
      return (
        dueDate.getFullYear() === day.getFullYear() &&
        dueDate.getMonth() === day.getMonth() &&
        dueDate.getDate() === day.getDate()
      );
    });
  return (
    <div
      className={
        "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
      }
      onDrop={() => itemDrop(day)}
      onDragOver={(e) => e.preventDefault()}
    >
      {day.getDate()}
      <ul className="list-disc ms-4">
        {todaysAssignments.map((a) => (
          <li key={a.name}>{a.name}</li>
        ))}
        {todaysQuizzes.map((q) => (
          <li
            key={q.name}
            role="button"
            draggable="true"
            onDragStart={() => startItemDrag({ type: "quiz", item: q })}
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
            // onDragStart={() => startItemDrag({ type: "page", item: p })}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}