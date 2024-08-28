"use client";
import { useCourseContext } from "../context/courseContext";
import ExpandableModule from "./ExpandableModule";

export default function ModuleList() {
  const {
    localCourse: { modules },
  } = useCourseContext();
  return (
    <div>
      {modules.map((m) => (
        <ExpandableModule key={m.name} module={m} />
      ))}
    </div>
  );
}
