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
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDayOfWeek } from "@/models/local/localCourse";
import { getModuleItemUrl } from "@/services/urlUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";

export default function Day({ day, month }: { day: string; month: number }) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day"
  );

  const { data: settings } = useLocalCourseSettingsQuery();
  const itemsContext = useCalendarItemsContext();
  const { itemDrop } = useDraggingContext();

  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const { todaysAssignments, todaysQuizzes, todaysPages } =
    getTodaysItems(todaysModules);

  const isInSameMonth = dayAsDate.getMonth() + 1 == month;

  const classIsToday = settings.daysOfWeek.includes(getDayOfWeek(dayAsDate));

  const todayClass = classIsToday ? " bg-slate-900 " : " ";
  const monthClass = isInSameMonth ? " border border-slate-600 " : " ";

  return (
    <div
      className={" rounded-lg pb-4 m-1 " + todayClass + monthClass}
      onDrop={(e) => itemDrop(e, day)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="ms-1">{dayAsDate.getDate()}</div>
      <div>
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
      </div>
    </div>
  );
}

function getTodaysItems(todaysModules: {
  [moduleName: string]: {
    assignments: LocalAssignment[];
    quizzes: LocalQuiz[];
    pages: LocalCoursePage[];
  };
}) {
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
  return { todaysAssignments, todaysQuizzes, todaysPages };
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
    <Link
      href={getModuleItemUrl(courseName, moduleName, type, item.name)}
      shallow={true}
      className={
        " border rounded-sm px-1 mx-1 break-all " +
        " border-slate-600 bg-slate-800 " + 
        " block "
      }
      role="button"
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "draggableItem",
          JSON.stringify({
            type,
            item,
            sourceModuleName: moduleName,
          })
        );
      }}
    >
      {item.name}
    </Link>
  );
}
