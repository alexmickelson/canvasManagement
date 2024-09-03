"use client";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCoursesHooks";
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
