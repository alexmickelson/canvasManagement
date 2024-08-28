"use client";

import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useCourseContext } from "../context/courseContext";

export default function Day({ day, month }: { day: Date; month: number }) {
  const context = useCourseContext();

  const backgroundClass = day.getMonth() + 1 != month ? "" : "bg-slate-900";

  const todaysAssignments = context.localCourse.modules
    .flatMap((m) => m.assignments)
    .filter((a) => {
      const dueDate = getDateFromStringOrThrow(
        a.dueAt,
        "due at for assignment in day"
      );

      const isSame =
        dueDate.getFullYear() === day.getFullYear() &&
        dueDate.getMonth() === day.getMonth() &&
        dueDate.getDate() === day.getDate();
      if (a.name === "Chapter 3") console.log(a.name, dueDate, day, isSame);
      return isSame;
    });
  const todaysQuizzes = context.localCourse.modules
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
  const todaysPages = context.localCourse.modules
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
    <div className={"border rounded rounded-3 p-2 pb-4 m-1 " + backgroundClass}>
      {day.getDate()}
      <ul className="list-disc ms-4">
        {todaysAssignments.map((a) => (
          <li key={a.name}> {a.name}</li>
        ))}
        {todaysQuizzes.map((q) => (
          <li key={q.name}> {q.name}</li>
        ))}
        {todaysPages.map((p) => (
          <li key={p.name}> {p.name}</li>
        ))}
      </ul>
    </div>
  );
}
