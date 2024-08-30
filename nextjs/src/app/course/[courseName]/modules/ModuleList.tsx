"use client";
import { useCourseContext } from "../context/courseContext";
import ExpandableModule from "./ExpandableModule";

export default function ModuleList() {
  return (
    <div>
      modules here
      {/* {modules.map((m) => (
        <ExpandableModule key={m.name} module={m} />
      ))} */}
    </div>
  );
}
