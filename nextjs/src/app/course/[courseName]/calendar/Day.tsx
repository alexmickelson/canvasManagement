"use client";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { useDraggingContext } from "../context/draggingContext";
import { useCalendarItemsContext } from "../context/calendarItemsContext";
import { useCourseContext } from "../context/courseContext";
import Link from "next/link";

export default function Day({ day, month }: { day: string; month: number }) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day"
  );
  const isInSameMonth = dayAsDate.getMonth() + 1 != month;
  const backgroundClass = isInSameMonth ? "" : "bg-slate-900";

  const itemsContext = useCalendarItemsContext();
  const { itemDrop } = useDraggingContext();
  const { courseName } = useCourseContext();

  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  return (
    <div
      className={
        "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
      }
      onDrop={(e) => {
        itemDrop(e, day);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {dayAsDate.getDate()}
      {todaysModules &&
        Object.keys(todaysModules).flatMap((moduleName) =>
          todaysModules[moduleName].assignments.map((a) => (
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
              <Link
                href={
                  "/course/" +
                  encodeURIComponent(courseName) +
                  "/modules/" +
                  encodeURIComponent(moduleName) +
                  "/assignment/" +
                  encodeURIComponent(a.name)
                }
                shallow={true}
              >
                {a.name}
              </Link>
            </li>
          ))
        )}
      {todaysModules &&
        Object.keys(todaysModules).flatMap((moduleName) =>
          todaysModules[moduleName].quizzes.map((q) => (
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
            >
              <Link
                href={
                  "/course/" +
                  encodeURIComponent(courseName) +
                  "/modules/" +
                  encodeURIComponent(moduleName) +
                  "/quiz/" +
                  encodeURIComponent(q.name)
                }
                shallow={true}
              >
                {q.name}
              </Link>
            </li>
          ))
        )}
      {todaysModules &&
        Object.keys(todaysModules).flatMap((moduleName) =>
          todaysModules[moduleName].pages.map((p) => (
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
              <Link
                href={
                  "/course/" +
                  encodeURIComponent(courseName) +
                  "/modules/" +
                  encodeURIComponent(moduleName) +
                  "/page/" +
                  encodeURIComponent(p.name)
                }
                shallow={true}
              >
                {p.name}
              </Link>
            </li>
          ))
        )}
    </div>
  );
}

// export default function Day({ day, month }: { day: string; month: number }) {
//   const { data: moduleNames } = useModuleNamesQuery();

//   const dayAsDate = getDateFromStringOrThrow(
//     day,
//     "calculating same month in day"
//   );
//   const isInSameMonth = dayAsDate.getMonth() + 1 != month;
//   const backgroundClass = isInSameMonth ? "" : "bg-slate-900";
//   const { itemDrop } = useDraggingContext();

//   return (
//     <div
//       className={
//         "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
//       }
//       onDrop={(e) => {
//         itemDrop(e, day);
//       }}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {dayAsDate.getDate()}
//       {moduleNames.map((moduleName) => (
//         <DayItemsInModule
//           key={"" + day + month + moduleName}
//           moduleName={moduleName}
//           day={day}
//         />
//       ))}
//     </div>
//   );
// }
