import React from "react";
import EditAssignment from "./EditAssignment";
import { Metadata } from "next";
import { getTitle } from "@/services/titleUtils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    courseName: string;
    assignmentName: string;
    moduleName: string;
  }>;
}): Promise<Metadata> {
  const { courseName, assignmentName } = await params;
  const decodedAssignmentName = decodeURIComponent(assignmentName);
  return {
    title: getTitle(`${decodedAssignmentName}, ${courseName}`),
  };
}

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
