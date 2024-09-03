"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useAssignmentQuery } from "@/hooks/localCourse/assignmentHooks";
import { localAssignmentMarkdown } from "@/models/local/assignment/localAssignment";
import { useState } from "react";
import AssignmentPreview from "./AssignmentPreview";

export default function EditAssignment({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const [assignmentText, setAssignmentText] = useState(
    localAssignmentMarkdown.toMarkdown(assignment)
  );
  const [error, setError] = useState("");

  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={assignmentText} onChange={setAssignmentText} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          <AssignmentPreview assignment={assignment} />
        </div>
      </div>
      <div className="p-5">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add to canvas....
        </button>
      </div>
    </div>
  );
}
