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
  const createAssignment = useCreateAssignmentMutation();
  const deleteLocal = useDeleteAssignmentMutation();
  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateInCanvas = useUpdateAssignmentInCanvasMutation();
  const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();

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
    createAssignment.mutate({
      courseName,
      moduleName,
      assignmentName: newName,
      assignment: { ...assignment, name: newName },
    });
    handleClose();
  };

  const handleDelete = () => {
    deleteLocal.mutate({ courseName, moduleName, assignmentName: item.name });
    handleClose();
  };

  const handleUpdateCanvas = () => {
    if (assignmentInCanvas) {
      updateInCanvas.mutate({
        canvasAssignmentId: assignmentInCanvas.id,
        assignment: item as LocalAssignment,
      });
      handleClose();
    }
  };

  const handleDeleteFromCanvas = () => {
    if (assignmentInCanvas) {
      deleteFromCanvas.mutate({
        canvasAssignmentId: assignmentInCanvas.id,
        assignmentName: item.name,
      });
      handleClose();
    }
  };

  const baseButtonClasses = "w-full text-left px-4 py-2";
  const normalHoverClasses = "hover:bg-slate-700 disabled:opacity-50";
  const dangerClasses =
    "bg-rose-900/30 hover:bg-rose-950 disabled:opacity-50 text-rose-50";
  return (
    <Modal modalControl={modalControl} backgroundCoverColor="bg-black/30">
      {() => (
        <>
        <div className="text-center p-1 text-slate-200">
          {item.name}
        </div>
          {confirmingDelete ? (
            <>
              <button
                disabled
                className={`${baseButtonClasses} ${normalHoverClasses}`}
              >
                Delete from disk?
              </button>
              <button
                onClick={handleDelete}
                className={`${baseButtonClasses} ${dangerClasses}`}
              >
                Yes, delete
              </button>
              <button
                onClick={handleClose}
                className={`${baseButtonClasses} ${normalHoverClasses}`}
              >
                Cancel
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
                    className="unstyled font-bold block px-3 py-1 hover:bg-slate-700 cursor-pointer"
                    onClick={handleClose}
                  >
                    View in Canvas
                  </a>
                  <button
                    onClick={handleUpdateCanvas}
                    disabled={updateInCanvas.isPending}
                    className="unstyled w-full text-left px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Update in Canvas
                  </button>
                  <button
                    onClick={handleDeleteFromCanvas}
                    disabled={deleteFromCanvas.isPending}
                    className={`unstyled ${baseButtonClasses} ${dangerClasses}`}
                  >
                    Delete from Canvas
                  </button>
                </>
              )}
              {!canvasUrl && (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className={`unstyled ${baseButtonClasses} ${dangerClasses}`}
                >
                  Delete from Disk
                </button>
              )}
              <button
                onClick={handleDuplicate}
                className={`unstyled ${baseButtonClasses} ${normalHoverClasses}`}
              >
                Duplicate
              </button>
            </>
          )}
        </>
      )}
    </Modal>
  );
};
