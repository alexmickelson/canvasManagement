"use client";
import { useCourseContext } from "../context/courseContext";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
import DayItemsInModule from "./DayItemsInModule";

export default function Day({ day, month }: { day: Date; month: number }) {
  const { courseName, itemDrop } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery(courseName);
  const isInSameMonth = day.getMonth() + 1 != month;
  const backgroundClass = isInSameMonth ? "" : "bg-slate-900";
  console.log("render");

  return (
    <>
      {moduleNames.map((moduleName) => (
        <div
          key={"" + day + month + moduleName}
          className={
            "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
          }
          onDrop={() => itemDrop(day)}
          onDragOver={(e) => e.preventDefault()}
        >
          {day.getDate()}
          <DayItemsInModule day={day} moduleName={moduleName} />
        </div>
      ))}
    </>
  );
}
