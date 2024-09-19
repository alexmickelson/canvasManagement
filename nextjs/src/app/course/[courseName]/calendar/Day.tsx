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
import { getLectureUrl, getModuleItemUrl } from "@/services/urlUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useCanvasAssignmentsQuery } from "@/hooks/canvas/canvasAssignmentHooks";
import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { useCanvasQuizzesQuery } from "@/hooks/canvas/canvasQuizHooks";
import { useCanvasPagesQuery } from "@/hooks/canvas/canvasPageHooks";
import { CanvasQuiz } from "@/models/canvas/quizzes/canvasQuizModel";
import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";

export default function Day({ day, month }: { day: string; month: number }) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day"
  );

  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: canvasPages } = useCanvasPagesQuery();
  const itemsContext = useCalendarItemsContext();
  const { itemDrop } = useDraggingContext();

  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const { todaysAssignments, todaysQuizzes, todaysPages } = getTodaysItems(
    todaysModules,
    canvasAssignments,
    canvasQuizzes,
    canvasPages
  );

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
      <DayTitle day={day} dayAsDate={dayAsDate} />
      <div>
        {todaysAssignments.map(({ assignment, moduleName, status }) => (
          <DraggableListItem
            key={assignment.name}
            type={"assignment"}
            moduleName={moduleName}
            item={assignment}
            status={status}
          />
        ))}
        {todaysQuizzes.map(({ quiz, moduleName, status }) => (
          <DraggableListItem
            key={quiz.name}
            type={"quiz"}
            moduleName={moduleName}
            item={quiz}
            status={status}
          />
        ))}
        {todaysPages.map(({ page, moduleName, status }) => (
          <DraggableListItem
            key={page.name}
            type={"page"}
            moduleName={moduleName}
            item={page}
            status={status}
          />
        ))}
      </div>
    </div>
  );
}

function DayTitle({ day, dayAsDate }: { day: string; dayAsDate: Date }) {
  const { courseName } = useCourseContext();
  return (
    <Link className="ms-1" href={getLectureUrl(courseName, day)}>
      {dayAsDate.getDate()}
    </Link>
  );
}

function getTodaysItems(
  todaysModules: {
    [moduleName: string]: {
      assignments: LocalAssignment[];
      quizzes: LocalQuiz[];
      pages: LocalCoursePage[];
    };
  },
  canvasAssignments: CanvasAssignment[],
  canvasQuizzes: CanvasQuiz[],
  canvasPages: CanvasPage[]
) {
  const todaysAssignments: {
    moduleName: string;
    assignment: LocalAssignment;
    status: "localOnly" | "unPublished" | "published";
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].assignments.map((assignment) => {
          const canvasAssignment = canvasAssignments.find(
            (c) => c.name === assignment.name
          );
          return {
            moduleName,
            assignment,
            status: canvasAssignment
              ? canvasAssignment.published
                ? "published"
                : "unPublished"
              : "localOnly",
          };
        })
      )
    : [];

  const todaysQuizzes: {
    moduleName: string;
    quiz: LocalQuiz;
    status: "localOnly" | "unPublished" | "published";
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].quizzes.map((quiz) => {
          const canvasQuiz = canvasQuizzes.find((q) => q.title === quiz.name);
          return {
            moduleName,
            quiz,
            status: canvasQuiz
              ? canvasQuiz.published
                ? "published"
                : "unPublished"
              : "localOnly",
          };
        })
      )
    : [];

  const todaysPages: {
    moduleName: string;
    page: LocalCoursePage;
    status: "localOnly" | "unPublished" | "published";
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].pages.map((page) => {
          const canvasPage = canvasPages.find((p) => p.title === page.name);
          return {
            moduleName,
            page,
            status: canvasPage
              ? canvasPage.published
                ? "published"
                : "unPublished"
              : "localOnly",
          };
        })
      )
    : [];
  return { todaysAssignments, todaysQuizzes, todaysPages };
}

function DraggableListItem({
  type,
  moduleName,
  status,
  item,
}: {
  type: "assignment" | "page" | "quiz";
  status: "localOnly" | "unPublished" | "published";
  moduleName: string;
  item: IModuleItem;
}) {
  const { courseName } = useCourseContext();
  return (
    <Link
      href={getModuleItemUrl(courseName, moduleName, type, item.name)}
      shallow={true}
      className={
        " border rounded-sm px-1 mx-1 break-all mb-1 " +
        "  bg-slate-800 " +
        " block " +
        (status === "localOnly" && " text-slate-500 border-slate-600 ") +
        (status === "unPublished" && " border-rose-900 ") +
        (status === "published" && " border-green-800 ")
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
