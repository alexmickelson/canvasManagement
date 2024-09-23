"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
} from "@/hooks/localCourse/assignmentHooks";
import { localAssignmentMarkdown } from "@/models/local/assignment/localAssignment";
import { useEffect, useState } from "react";
import AssignmentPreview from "./AssignmentPreview";
import { getCourseUrl, getModuleItemUrl } from "@/services/urlUtils";
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
import { AssignmentSubmissionType } from "@/models/local/assignment/assignmentSubmissionType";
import { LocalCourseSettings } from "@/models/local/localCourse";
import { useRouter } from "next/navigation";

export default function EditAssignment({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const updateAssignment = useUpdateAssignmentMutation();

  const [assignmentText, setAssignmentText] = useState(
    localAssignmentMarkdown.toMarkdown(assignment)
  );
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

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
          updateAssignment
            .mutateAsync({
              assignment: updatedAssignment,
              moduleName,
              assignmentName: updatedAssignment.name,
              previousModuleName: moduleName,
              previousAssignmentName: assignmentName,
            })
            .then(() => {
              if (updatedAssignment.name !== assignmentName)
                router.replace(
                  getModuleItemUrl(
                    courseName,
                    moduleName,
                    "assignment",
                    updatedAssignment.name
                  )
                );
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
    courseName,
    moduleName,
    router,
    updateAssignment,
  ]);

  return (
    <div className="h-full flex flex-col align-middle px-1">
      <div className={"min-h-0 flex flex-row w-full flex-grow"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{getHelpString(settings)}</code>
          </pre>
        )}
        <div className="flex-1 h-full">
          <MonacoEditor value={assignmentText} onChange={setAssignmentText} />
        </div>
        <div className="flex-1 h-full">
          <div className="text-red-300">{error && error}</div>

          <div className="px-3 h-full">
            <AssignmentPreview assignment={assignment} />
          </div>
        </div>
      </div>
      <ClientOnly>
        <SuspenseAndErrorHandling>
          <AssignmentButtons
            moduleName={moduleName}
            assignmentName={assignmentName}
            toggleHelp={() => setShowHelp((h) => !h)}
          />
        </SuspenseAndErrorHandling>
      </ClientOnly>
    </div>
  );
}

function getHelpString(settings: LocalCourseSettings) {
  const groupNames = settings.assignmentGroups.map((g) => g.name).join("\n- ");
  const helpString = `SubmissionTypes:
- ${AssignmentSubmissionType.ONLINE_TEXT_ENTRY}
- ${AssignmentSubmissionType.ONLINE_UPLOAD}
- ${AssignmentSubmissionType.DISCUSSION_TOPIC}
AllowedFileUploadExtensions:
- pdf
- jpg
- jpeg
- png
Assignment Group Names:
- ${groupNames}`;
  return helpString;
}

function AssignmentButtons({
  moduleName,
  assignmentName,
  toggleHelp,
}: {
  assignmentName: string;
  moduleName: string;
  toggleHelp: () => void;
}) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const {
    data: canvasAssignments,
    isPending: canvasIsPending,
    isRefetching: canvasIsRefetching,
  } = useCanvasAssignmentsQuery();
  const {
    data: assignment,
    isPending: assignmentIsPending,
    isRefetching,
  } = useAssignmentQuery(moduleName, assignmentName);
  const addToCanvas = useAddAssignmentToCanvasMutation();
  const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();
  const updateAssignment = useUpdateAssignmentInCanvasMutation();

  const assignmentInCanvas = canvasAssignments.find(
    (a) => a.name === assignmentName
  );

  const anythingIsLoading =
    addToCanvas.isPending ||
    canvasIsPending ||
    assignmentIsPending ||
    isRefetching ||
    canvasIsRefetching ||
    deleteFromCanvas.isPending ||
    updateAssignment.isPending;
    
  return (
    <div className="p-5 flex flex-row justify-between gap-3">
      <div>
        <button onClick={toggleHelp}>Toggle Help</button>
      </div>
      <div className="flex flex-row gap-3 justify-end">
        {anythingIsLoading && <Spinner />}
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
    </div>
  );
}
