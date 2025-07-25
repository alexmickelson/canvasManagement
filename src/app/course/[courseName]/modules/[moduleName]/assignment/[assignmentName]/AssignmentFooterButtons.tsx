import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasAssignmentsQuery,
  useAddAssignmentToCanvasMutation,
  useDeleteAssignmentFromCanvasMutation,
  useUpdateAssignmentInCanvasMutation,
} from "@/features/canvas/hooks/canvasAssignmentHooks";
import { baseCanvasUrl } from "@/features/canvas/services/canvasServiceUtils";
import {
  useAssignmentQuery,
  useDeleteAssignmentMutation,
} from "@/features/local/assignments/assignmentHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AssignmentFooterButtons({
  moduleName,
  assignmentName,
  toggleHelp,
}: {
  assignmentName: string;
  moduleName: string;
  toggleHelp: () => void;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: canvasAssignments, isFetching: canvasIsFetching } =
    useCanvasAssignmentsQuery();
  const { data: assignment, isFetching } = useAssignmentQuery(
    moduleName,
    assignmentName
  );
  const addToCanvas = useAddAssignmentToCanvasMutation();
  const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();
  const updateAssignment = useUpdateAssignmentInCanvasMutation();
  const deleteLocal = useDeleteAssignmentMutation();
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  const assignmentInCanvas = canvasAssignments?.find(
    (a) => a.name === assignmentName
  );

  const anythingIsLoading =
    addToCanvas.isPending ||
    canvasIsFetching ||
    isFetching ||
    deleteFromCanvas.isPending ||
    updateAssignment.isPending;

  return (
    <div className="p-5 flex flex-row justify-between gap-3">
      <div>
        <button onClick={toggleHelp}>Toggle Help</button>
      </div>
      <div className="flex flex-row gap-3 justify-end">
        {anythingIsLoading && <Spinner />}
        {assignmentInCanvas && !assignmentInCanvas?.published && (
          <div className="text-rose-300 my-auto">Not Published</div>
        )}
        {!assignmentInCanvas && (
          <button
            disabled={addToCanvas.isPending}
            onClick={() => addToCanvas.mutate({ assignment, moduleName })}
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
        {!assignmentInCanvas && (
          <Modal
            modalControl={modal}
            buttonText="Delete Localy"
            buttonClass="btn-danger"
            modalWidth="w-1/5"
          >
            {({ closeModal }) => (
              <div>
                <div className="text-center">
                  Are you sure you want to delete this assignment locally?
                </div>
                <br />
                <div className="flex justify-around gap-3">
                  <button
                    onClick={async () => {
                      router.push(getCourseUrl(courseName));
                      setIsLoading(true);
                      await deleteLocal.mutateAsync({
                        moduleName,
                        assignmentName,
                        courseName,
                      });
                      router.refresh();
                      // setIsLoading(false); //refreshing the router will make spinner go away
                    }}
                    disabled={deleteLocal.isPending || isLoading}
                    className="btn-danger"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={deleteLocal.isPending || isLoading}
                  >
                    No
                  </button>
                </div>
                {(deleteLocal.isPending || isLoading) && <Spinner />}
              </div>
            )}
          </Modal>
        )}
        <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
          Go Back
        </Link>
      </div>
    </div>
  );
}
