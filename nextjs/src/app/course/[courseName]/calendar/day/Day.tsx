"use client";
import {
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { useDraggingContext } from "../../context/draggingContext";
import { useCourseContext } from "../../context/courseContext";
import Link from "next/link";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getDayOfWeek } from "@/models/local/localCourse";
import { getLectureUrl } from "@/services/urlUtils";
import DropTargetStyling from "../../../../../components/DropTargetStyling";
import { ItemInDay } from "./ItemInDay";
import { useTodaysItems } from "./useTodaysItems";
import Modal from "@/components/Modal";
import NewItemForm from "../../modules/NewItemForm";

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

  const semesterStart = getDateFromStringOrThrow(
    settings.startDate,
    "comparing start date in day"
  );
  const semesterEnd = getDateFromStringOrThrow(
    settings.endDate,
    "comparing end date in day"
  );

  const isInSemester = semesterStart < dayAsDate&& semesterEnd > dayAsDate;

  const meetingClasses =
    classOnThisDay && isInSemester ? " bg-slate-900 " : " ";
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
              <ItemInDay
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
            <ItemInDay
              key={quiz.name}
              type={"quiz"}
              moduleName={moduleName}
              item={quiz}
              status={status}
              message={message}
            />
          ))}
          {todaysPages.map(({ page, moduleName, status, message }) => (
            <ItemInDay
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
    <div className="flex justify-between">
      <Link className="ms-1" href={getLectureUrl(courseName, day)}>
        {dayAsDate.getDate()}
      </Link>
      <Modal
        buttonText="+"
        buttonClass="unstyled hover:font-bold px-1 mb-auto mt-0 pt-0"
      >
        {({ closeModal }) => (
          <div>
            <NewItemForm creationDate={day} onCreate={closeModal} />
            <br />
            <button onClick={closeModal}>close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
