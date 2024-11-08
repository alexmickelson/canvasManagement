import React from "react";
import EditAssignment from "./EditAssignment";

export default async function Page({
  params,
}: {
  params: Promise<{ assignmentName: string; moduleName: string }>;
}) {
  const { moduleName, assignmentName } = await params;
  const decodedAssignmentName = decodeURIComponent(assignmentName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return (
    <EditAssignment
      assignmentName={decodedAssignmentName}
      moduleName={decodedModuleName}
    />
  );
}
