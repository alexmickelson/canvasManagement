"use client";
import { getDateFromStringOrThrow } from "@/models/local/utils/timeUtils";
import { getMonthsBetweenDates } from "./calendarMonthUtils";
import { CalendarMonth } from "./CalendarMonth";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useEffect, useMemo, useRef } from "react";
import CalendarItemsContextProvider from "../context/CalendarItemsContextProvider";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";

export default function CourseCalendar() {
  const [settings] = useLocalCourseSettingsQuery();

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
        border-4
        border-gray-900
        rounded-lg
        bg-slate-950
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
