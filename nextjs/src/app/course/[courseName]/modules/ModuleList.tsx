"use client";
import {  useModuleNamesQuery } from "@/hooks/localCourse/localCourseModuleHooks";
import ExpandableModule from "./ExpandableModule";
import CreateModule from "./CreateModule";

export default function ModuleList() {
  const { data: moduleNames } = useModuleNamesQuery();
  return (
    <div>
      <CreateModule />
      {moduleNames.map((m) => (
        <ExpandableModule key={m} moduleName={m} />
      ))}
    </div>
  );
}
