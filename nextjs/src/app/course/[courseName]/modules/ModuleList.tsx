"use client";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useCourseContext } from "../context/courseContext";
import ExpandableModule from "./ExpandableModule";

export default function ModuleList() {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery(courseName);
  return (
    <div>
      modules here
      {moduleNames.map((m) => (
        <ExpandableModule key={m} moduleName={m}/>
      ))}
    </div>
  );
}
