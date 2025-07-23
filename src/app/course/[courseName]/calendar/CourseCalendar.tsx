"use client";
import { getDateFromStringOrThrow } from "@/features/local/utils/timeUtils";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useEffect, useMemo, useRef } from "react";
import CalendarItemsContextProvider from "../context/CalendarItemsContextProvider";

export default function CourseCalendar() {
  const { data: settings } = useLocalCourseSettingsQuery();

  const startDateTime = useMemo(
    () => getDateFromStringOrThrow(settings.startDate, "course start date"),
    [settings.startDate]
  );
  const endDateTime = useMemo(
    () => getDateFromStringOrThrow(settings.endDate, "course end date"),
    [settings.endDate]
  );
  const months = useMemo(
    () => getMonthsBetweenDates(startDateTime, endDateTime),
    [endDateTime, startDateTime]
  );
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storageKey = `courseScroll-${settings.name}`;
    const scrollValue = localStorage.getItem(storageKey);
    console.log("resetting scroll", scrollValue, divRef.current);

    const yValue = scrollValue ? parseInt(scrollValue) : 0;

    if (!divRef.current) console.log("cannot scroll, ref is null");
    else {
      divRef.current.scroll({
        top: yValue,
        left: 0,
        // behavior: "smooth"
      });
    }
  }, [settings.name]);

  return (
    <div
      className="
        min-h-0
        flex-grow
        border-2
        border-gray-900
        rounded-lg
        bg-linear-to-br
        from-blue-950/30
        to-fuchsia-950/10 to-60%
        sm:p-1
      "
    >
      <div
        className="h-full overflow-y-scroll sm:pe-1"
        onScroll={(e) => {
          const storageKey = `courseScroll-${settings.name}`;
          localStorage.setItem(
            storageKey,
            e.currentTarget.scrollTop.toString()
          );
        }}
        ref={divRef}
      >
        <CalendarItemsContextProvider>
          {months.map((month) => (
            <CalendarMonth key={month.month + "" + month.year} month={month} />
          ))}
        </CalendarItemsContextProvider>
      </div>
    </div>
  );
}
