import React from "react";
import EditAssignment from "./EditAssignment";
import ClientOnly from "@/components/ClientOnly";

export default function Page({
  params: { moduleName, assignmentName },
}: {
  params: { assignmentName: string; moduleName: string };
}) {
  const decodedAssignmentName = decodeURIComponent(assignmentName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return (
    <EditAssignment
      assignmentName={decodedAssignmentName}
      moduleName={decodedModuleName}
    />
  );
}
