"use client";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useCourseContext } from "../context/courseContext";
import ExpandableModule from "./ExpandableModule";

export default function ModuleList() {
  const { data: moduleNames } = useModuleNamesQuery();
  return (
    <div>
      {moduleNames.map((m) => (
        <ExpandableModule key={m} moduleName={m}/>
      ))}
    </div>
  );
}
