import React from "react";
import EditAssignment from "./EditAssignment";

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
