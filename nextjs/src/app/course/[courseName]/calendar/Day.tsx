"use client";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
import DayItemsInModule from "./DayItemsInModule";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useDraggingContext } from "../context/DraggingContext";

export default function Day({ day, month }: { day: string; month: number }) {
  const { data: moduleNames } = useModuleNamesQuery();

  const dayAsDate = getDateFromStringOrThrow(day, "calculating same month in day")
  const isInSameMonth =
  dayAsDate.getMonth() + 1 !=
    month;
  const backgroundClass = isInSameMonth ? "" : "bg-slate-900";

  return (
    <div
      className={
        "border border-slate-600 rounded-lg p-2 pb-4 m-1 " + backgroundClass
      }
    >
      {dayAsDate.getDate()}
      {moduleNames.map((moduleName) => (
        <ModuleInDay
          key={"" + day + month + moduleName}
          moduleName={moduleName}
          day={day}
        />
      ))}
    </div>
  );
}

function ModuleInDay({ moduleName, day }: { moduleName: string; day: string }) {
  const { itemDrop } = useDraggingContext();
  return (
    <div onDrop={() => itemDrop(day)} onDragOver={(e) => e.preventDefault()}>
      <DayItemsInModule day={day} moduleName={moduleName} />
    </div>
  );
}
