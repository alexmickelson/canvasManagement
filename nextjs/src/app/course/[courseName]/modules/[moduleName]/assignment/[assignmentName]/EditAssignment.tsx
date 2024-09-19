"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
} from "@/hooks/localCourse/assignmentHooks";
import { localAssignmentMarkdown } from "@/models/local/assignment/localAssignment";
import { useEffect, useState } from "react";
import AssignmentPreview from "./AssignmentPreview";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import {
  useAddAssignmentToCanvasMutation,
  useCanvasAssignmentsQuery,
  useDeleteAssignmentFromCanvasMutation,
  useUpdateAssignmentInCanvasMutation,
} from "@/hooks/canvas/canvasAssignmentHooks";
import { Spinner } from "@/components/Spinner";
import { baseCanvasUrl } from "@/services/canvas/canvasServiceUtils";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";

export default function EditAssignment({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const updateAssignment = useUpdateAssignmentMutation();

  const [assignmentText, setAssignmentText] = useState(
    localAssignmentMarkdown.toMarkdown(assignment)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      try {
        const updatedAssignment =
          localAssignmentMarkdown.parseMarkdown(assignmentText);
        if (
          localAssignmentMarkdown.toMarkdown(assignment) !==
          localAssignmentMarkdown.toMarkdown(updatedAssignment)
        ) {
          console.log("updating assignment");
          updateAssignment.mutate({
            assignment: updatedAssignment,
            moduleName,
            assignmentName,
          });
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [
    assignment,
    assignmentName,
    assignmentText,
    moduleName,
    updateAssignment,
  ]);

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
      <ClientOnly>
        <SuspenseAndErrorHandling>
          <AssignmentButtons
            moduleName={moduleName}
            assignmentName={assignmentName}
          />
        </SuspenseAndErrorHandling>
      </ClientOnly>
    </div>
  );
}

function AssignmentButtons({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const addToCanvas = useAddAssignmentToCanvasMutation();
  const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();
  const updateAssignment = useUpdateAssignmentInCanvasMutation();

  const assignmentInCanvas = canvasAssignments.find(
    (a) => a.name === assignmentName
  );
  return (
    <div className="p-5 flex flex-row justify-end gap-3">
      {(addToCanvas.isPending ||
        deleteFromCanvas.isPending ||
        updateAssignment.isPending) && <Spinner />}
      {assignmentInCanvas && !assignmentInCanvas.published && (
        <div className="text-rose-300 my-auto">Not Published</div>
      )}
      {!assignmentInCanvas && (
        <button
          disabled={addToCanvas.isPending}
          onClick={() => addToCanvas.mutate(assignment)}
        >
          Add to canvas
        </button>
      )}
      {assignmentInCanvas && (
        <a
          className="btn"
          target="_blank"
          href={`${baseCanvasUrl}/courses/${settings.canvasId}/assignments/${assignmentInCanvas.id}`}
        >
          View in Canvas
        </a>
      )}
      {assignmentInCanvas && (
        <button
          className=""
          disabled={deleteFromCanvas.isPending}
          onClick={() =>
            updateAssignment.mutate({
              canvasAssignmentId: assignmentInCanvas.id,
              assignment,
            })
          }
        >
          Update in Canvas
        </button>
      )}
      {assignmentInCanvas && (
        <button
          className="btn-danger"
          disabled={deleteFromCanvas.isPending}
          onClick={() =>
            deleteFromCanvas.mutate({
              canvasAssignmentId: assignmentInCanvas.id,
              assignmentName: assignment.name,
            })
          }
        >
          Delete from Canvas
        </button>
      )}
      <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
        Go Back
      </Link>
    </div>
  );
}
