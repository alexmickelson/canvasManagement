"use client";
import { useEffect, FC, useState } from "react";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { useCalendarItemsContext } from "../../../context/calendarItemsContext";
import {
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "@/features/local/assignments/assignmentHooks";
import {
  useCanvasAssignmentsQuery,
  useUpdateAssignmentInCanvasMutation,
  useDeleteAssignmentFromCanvasMutation,
  useAddAssignmentToCanvasMutation,
} from "@/features/canvas/hooks/canvasAssignmentHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { baseCanvasUrl } from "@/features/canvas/services/canvasServiceUtils";
import { useCourseContext } from "../../../context/courseContext";
import Modal, { ModalControl } from "@/components/Modal";

function getDuplicateName(name: string, existingNames: string[]): string {
  const match = name.match(/^(.*)\s+(\d+)$/);
  const baseName = match ? match[1] : name;
  const startNum = match ? parseInt(match[2]) + 1 : 2;
  let num = startNum;
  while (existingNames.includes(`${baseName} ${num}`)) {
    num++;
  }
  return `${baseName} ${num}`;
}

export const AssignmentDayItemContextMenu: FC<{
  modalControl: ModalControl;
  item: IModuleItem;
  moduleName: string;
}> = ({ modalControl, item, moduleName }) => {
  const { courseName } = useCourseContext();
  const calendarItems = useCalendarItemsContext();
  const createAssignmentMutation = useCreateAssignmentMutation();
  const deleteLocalMutation = useDeleteAssignmentMutation();
  const updateInCanvasMutation = useUpdateAssignmentInCanvasMutation();
  const deleteFromCanvasMutation = useDeleteAssignmentFromCanvasMutation();
  const addToCanvasMutation = useAddAssignmentToCanvasMutation();
  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: settings } = useLocalCourseSettingsQuery();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const assignmentInCanvas = canvasAssignments?.find(
    (a) => a.name === item.name,
  );

  const canvasUrl = assignmentInCanvas
    ? `${baseCanvasUrl}/courses/${settings.canvasId}/assignments/${assignmentInCanvas.id}`
    : undefined;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmingDelete(false);
        modalControl.closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalControl]);

  const handleClose = () => {
    setConfirmingDelete(false);
    modalControl.closeModal();
  };

  const handleDuplicate = () => {
    const assignment = item as LocalAssignment;
    const existingNames = Object.values(calendarItems).flatMap((modules) =>
      (modules[moduleName]?.assignments ?? []).map((a) => a.name),
    );
    const newName = getDuplicateName(item.name, existingNames);
    createAssignmentMutation.mutate({
      courseName,
      moduleName,
      assignmentName: newName,
      assignment: { ...assignment, name: newName },
    });
    handleClose();
  };

  const handleDelete = () => {
    deleteLocalMutation.mutate({ courseName, moduleName, assignmentName: item.name });
    handleClose();
  };

  const handleUpdateCanvas = () => {
    if (assignmentInCanvas) {
      updateInCanvasMutation.mutate({
        canvasAssignmentId: assignmentInCanvas.id,
        assignment: item as LocalAssignment,
      });
      handleClose();
    }
  };

  const handleDeleteFromCanvas = () => {
    if (assignmentInCanvas) {
      deleteFromCanvasMutation.mutate({
        canvasAssignmentId: assignmentInCanvas.id,
        assignmentName: item.name,
      });
      handleClose();
    }
  };

  const handleAddToCanvas = () => {
    addToCanvasMutation.mutate({
      assignment: item as LocalAssignment,
      moduleName,
    });
    handleClose();
  };

  const baseButtonClasses = " font-bold text-left py-1";
  const normalButtonClass =
    "hover:bg-blue-900   disabled:opacity-50 bg-blue-900/50 text-blue-50 border border-blue-800/70 rounded ";
  const dangerClasses =
    "bg-rose-900/30 hover:bg-rose-950 disabled:opacity-50 text-rose-50 border border-rose-900/40 rounded";
  return (
    <Modal modalControl={modalControl} backgroundCoverColor="bg-black/30">
      {() => (
        <div className="p-2">
          <div className="text-center p-1 text-slate-200 ">{item.name}</div>
          <div className="flex flex-col gap-2">
            {confirmingDelete ? (
              <>
                <div
                  className={``}
                >
                  Delete from disk?
                </div>
                <button
                  onClick={handleClose}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className={`unstyled ${baseButtonClasses} ${dangerClasses}`}
                >
                  Yes, delete
                </button>
              </>
            ) : (
              <>
                {canvasUrl && (
                  <>
                    <a
                      href={canvasUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={` block px-3 ${baseButtonClasses} ${normalButtonClass}`}
                      onClick={handleClose}
                    >
                      View in Canvas
                    </a>
                    <button
                      onClick={handleUpdateCanvas}
                      disabled={updateInCanvasMutation.isPending}
                      className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                    >
                      Update in Canvas
                    </button>
                    <button
                      onClick={handleDeleteFromCanvas}
                      disabled={deleteFromCanvasMutation.isPending}
                      className={`unstyled ${baseButtonClasses} ${dangerClasses}`}
                    >
                      Delete from Canvas
                    </button>
                  </>
                )}
                {!canvasUrl && (
                  <>
                    <button
                      onClick={handleAddToCanvas}
                      disabled={addToCanvasMutation.isPending}
                      className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                    >
                      Add to Canvas
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(true)}
                      className={`unstyled ${baseButtonClasses} ${dangerClasses}`}
                    >
                      Delete from Disk
                    </button>
                  </>
                )}
                <button
                  onClick={handleDuplicate}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Duplicate
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
