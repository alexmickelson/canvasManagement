import EditAssignment from "@/components/modules/assignments/EditAssignment";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const router = useRouter();
  const decodedAssignmentName = decodeURIComponent(
    router.query?.assignmentName as string
  );
  const decodedModuleName = decodeURIComponent(
    router.query?.moduleName as string
  );

  return (
    <EditAssignment
      assignmentName={decodedAssignmentName}
      moduleName={decodedModuleName}
    />
  );
}
