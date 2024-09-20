"use client";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { DraggableItem, useDraggingContext } from "../context/draggingContext";
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
import { useCanvasQuizzesQuery } from "@/hooks/canvas/canvasQuizHooks";
import { useCanvasPagesQuery } from "@/hooks/canvas/canvasPageHooks";
import DropTargetStyling from "./DropTargetStyling";
import { CanvasQuiz } from "@/models/canvas/quizzes/canvasQuizModel";
import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { canvasService } from "@/services/canvas/canvasService";
import { ReactNode } from "react";

export default function Day({ day, month }: { day: string; month: number }) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day"
  );
  const isToday =
    getDateOnlyMarkdownString(new Date()) ===
    getDateOnlyMarkdownString(dayAsDate);

  const { data: settings } = useLocalCourseSettingsQuery();
  const { itemDropOnDay } = useDraggingContext();

  const { todaysAssignments, todaysQuizzes, todaysPages } = useTodaysItems(day);

  const isInSameMonth = dayAsDate.getMonth() + 1 == month;

  const classOnThisDay = settings.daysOfWeek.includes(getDayOfWeek(dayAsDate));

  const meetingClasses = classOnThisDay ? " bg-slate-900 " : " ";
  const monthClass = isInSameMonth
    ? isToday
      ? " border border-blue-700 shadow-[0_0px_10px_0px] shadow-blue-500/50 "
      : " border border-slate-700 "
    : " ";

  return (
    <div
      className={" rounded-lg m-1 min-h-10 " + meetingClasses + monthClass}
      onDrop={(e) => itemDropOnDay(e, day)}
      onDragOver={(e) => e.preventDefault()}
    >
      <DropTargetStyling draggingClassName="bg-slate-900 shadow-[0_0px_10px_0px] shadow-blue-800/50 ">
        <DayTitle day={day} dayAsDate={dayAsDate} />
        <div>
          {todaysAssignments.map(
            ({ assignment, moduleName, status, message }) => (
              <DraggableListItem
                key={assignment.name}
                type={"assignment"}
                moduleName={moduleName}
                item={assignment}
                status={status}
                message={message}
              />
            )
          )}
          {todaysQuizzes.map(({ quiz, moduleName, status, message }) => (
            <DraggableListItem
              key={quiz.name}
              type={"quiz"}
              moduleName={moduleName}
              item={quiz}
              status={status}
              message={message}
            />
          ))}
          {todaysPages.map(({ page, moduleName, status, message }) => (
            <DraggableListItem
              key={page.name}
              type={"page"}
              moduleName={moduleName}
              item={page}
              status={status}
              message={message}
            />
          ))}
        </div>
      </DropTargetStyling>
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

function useTodaysItems(day: string) {
  const dayAsDate = getDateFromStringOrThrow(
    day,
    "calculating same month in day items"
  );
  const itemsContext = useCalendarItemsContext();
  const dateKey = getDateOnlyMarkdownString(dayAsDate);
  const todaysModules = itemsContext[dateKey];

  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: canvasPages } = useCanvasPagesQuery();
  const todaysAssignments: {
    moduleName: string;
    assignment: LocalAssignment;
    status: "localOnly" | "incomplete" | "published";
    message: ReactNode;
  }[] = todaysModules
    ? Object.keys(todaysModules).flatMap((moduleName) =>
        todaysModules[moduleName].assignments.map((assignment) => {
          const canvasAssignment = canvasAssignments.find(
            (c) => c.name === assignment.name
          );
          return {
            moduleName,
            assignment,
            ...getStatus({
              item: assignment,
              canvasItem: canvasAssignment,
              type: "assignment",
            }),
          };
        })
      )
    : [];

  const todaysQuizzes: {
    moduleName: string;
    quiz: LocalQuiz;
    status: "localOnly" | "incomplete" | "published";
    message: string;
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
                : "incomplete"
              : "localOnly",
            message: "",
          };
        })
      )
    : [];

  const todaysPages: {
    moduleName: string;
    page: LocalCoursePage;
    status: "localOnly" | "incomplete" | "published";
    message: string;
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
                : "incomplete"
              : "localOnly",
            message: "",
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
  message,
}: {
  type: "assignment" | "page" | "quiz";
  status: "localOnly" | "incomplete" | "published";
  moduleName: string;
  item: IModuleItem;
  message: ReactNode;
}) {
  const { courseName } = useCourseContext();
  const { dragStart } = useDraggingContext();
  return (
    <Link
      href={getModuleItemUrl(courseName, moduleName, type, item.name)}
      shallow={true}
      className={
        " relative group " +
        " border rounded-sm px-1 mx-1 break-words mb-1 " +
        " bg-slate-800 " +
        " block " +
        (status === "localOnly" && " text-slate-500 border-slate-600 ") +
        (status === "incomplete" && " border-rose-900 ") +
        (status === "published" && " border-green-800 ")
      }
      role="button"
      draggable="true"
      onDragStart={(e) => {
        const draggableItem: DraggableItem = {
          type,
          item,
          sourceModuleName: moduleName,
        };
        e.dataTransfer.setData("draggableItem", JSON.stringify(draggableItem));
        dragStart();
      }}
    >
      {item.name}
      {status === "incomplete" && (
        <div
          className={
            " absolute opacity-0 transition-all duration-700 " +
            " group-hover:block group-hover:opacity-100" +
            " bg-gray-800 text-white text-sm " +
            " rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2 " +
            " whitespace-no-wrap min-w-full max-w-96 "
          }
          role="tooltip"
        >
          {message}
        </div>
      )}
    </Link>
  );
}

const getStatus = ({
  item,
  canvasItem,
  type,
}: {
  item: LocalQuiz | LocalAssignment | LocalCoursePage;
  canvasItem?: CanvasQuiz | CanvasAssignment | CanvasPage;
  type: "assignment" | "page" | "quiz";
}): {
  status: "localOnly" | "incomplete" | "published";
  message: ReactNode;
} => {
  if (!canvasItem) return { status: "localOnly", message: "not in canvas" };

  if (!canvasItem.published)
    return { status: "incomplete", message: "not published in canvas" };

  if (type === "assignment") {
    const assignment = item as LocalAssignment;
    const canvasAssignment = canvasItem as CanvasAssignment;

    if(canvasAssignment.name === "Javascript 1")
      console.log('js 1', canvasAssignment.due_at, canvasAssignment);


    if (!canvasAssignment.due_at)
      return { status: "incomplete", message: "due date not in canvas" };

    if (assignment.lockAt && !canvasAssignment.lock_at)
      return { status: "incomplete", message: "lock date not in canvas" };

    const localDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(assignment.dueAt, "comparing due dates for day")
    );
    const canvasDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(
        canvasAssignment.due_at,
        "comparing canvas due date for day"
      )
    );
    if (localDueDate !== canvasDueDate) {
      return {
        status: "incomplete",
        message: (
          <div>
            due date different
            <div>{localDueDate}</div>
            <div>{canvasDueDate}</div>
          </div>
        ),
      };
    }
  }

  return { status: "published", message: "" };
};
