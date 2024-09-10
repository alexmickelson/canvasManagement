"use client";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { useDraggingContext } from "../context/draggingContext";
import { useCalendarItemsContext } from "../context/calendarItemsContext";
import { useCourseContext } from "../context/courseContext";
import Link from "next/link";
import { IModuleItem } from "@/models/local/IModuleItem";

export default function Day({ day, month }: { day: string; month: number }) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day"
  );
  const isInSameMonth = dayAsDate.getMonth() + 1 != month;
  const backgroundClass = isInSameMonth ? "" : "bg-slate-900";

  const itemsContext = useCalendarItemsContext();
  const { itemDrop } = useDraggingContext();

  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const todaysAssignments = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].assignments.map((assignment) => ({
          moduleName,
          assignment,
        }))
      )
    : [];

  const todaysQuizzes = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].quizzes.map((quiz) => ({
          moduleName,
          quiz,
        }))
      )
    : [];

  const todaysPages = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].pages.map((page) => ({
          moduleName,
          page,
        }))
      )
    : [];

  return (
    <div
      className={
        "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
      }
      onDrop={(e) => itemDrop(e, day)}
      onDragOver={(e) => e.preventDefault()}
    >
      {dayAsDate.getDate()}
      <ul className="list-disc">
        {todaysAssignments.map(({ assignment, moduleName }) => (
          <DraggableListItem
            key={assignment.name}
            type={"assignment"}
            moduleName={moduleName}
            item={assignment}
          />
        ))}
        {todaysQuizzes.map(({ quiz, moduleName }) => (
          <DraggableListItem
            key={quiz.name}
            type={"quiz"}
            moduleName={moduleName}
            item={quiz}
          />
        ))}
        {todaysPages.map(({ page, moduleName }) => (
          <DraggableListItem
            key={page.name}
            type={"page"}
            moduleName={moduleName}
            item={page}
          />
        ))}
      </ul>
    </div>
  );
}

function DraggableListItem({
  type,
  moduleName,
  item,
}: {
  type: "assignment" | "page" | "quiz";
  moduleName: string;
  item: IModuleItem;
}) {
  const { courseName } = useCourseContext();
  return (
    <li
      role="button"
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "draggableItem",
          JSON.stringify({
            type: "assignment",
            item,
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
          `/${type}/` +
          encodeURIComponent(item.name)
        }
        shallow={true}
      >
        {item.name}
      </Link>
    </li>
  );
}
