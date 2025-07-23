"use client";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";
import { useDraggingContext } from "../../context/drag/draggingContext";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { ItemInDay } from "./ItemInDay";
import { useTodaysItems } from "./useTodaysItems";
import { DayTitle } from "./DayTitle";
import { getDayOfWeek } from "@/features/local/course/localCourseSettings";

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

  // maybe this is slow?
  const holidayNameToday = settings.holidays.reduce(
    (holidaysHappeningToday, holiday) => {
      const holidayDates = holiday.days.map((d) =>
        getDateOnlyMarkdownString(
          getDateFromStringOrThrow(d, "holiday date in day component")
        )
      );
      const today = getDateOnlyMarkdownString(dayAsDate);

      if (holidayDates.includes(today))
        return [...holidaysHappeningToday, holiday.name];
      return holidaysHappeningToday;
    },
    [] as string[]
  );

  const semesterStart = getDateFromStringOrThrow(
    settings.startDate,
    "comparing start date in day"
  );
  const semesterEnd = getDateFromStringOrThrow(
    settings.endDate,
    "comparing end date in day"
  );

  const isInSemester = semesterStart < dayAsDate && semesterEnd > dayAsDate;

  const meetingClasses =
    classOnThisDay && isInSemester && holidayNameToday.length === 0
      ? " bg-slate-900 "
      : " bg-gray-950";

  const todayClasses = isToday
    ? " border  border-blue-700 shadow-[0_0px_10px_0px] shadow-blue-500/50 "
    : " ";

  const monthClass =
    isInSameMonth && !isToday ? " border border-slate-700 " : " ";

  return (
    <div
      className={
        " rounded-lg sm:m-1 m-0.5 min-h-10 " +
        meetingClasses +
        monthClass +
        todayClasses
      }
      onDrop={(e) => itemDropOnDay(e, day)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="draggingDay flex flex-col">
        <DayTitle day={day} dayAsDate={dayAsDate} />
        <div className="flex-grow">
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
        <div>
          {holidayNameToday.map((n) => (
            <div key={n} className="font-extrabold text-blue-100 text-center">
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
