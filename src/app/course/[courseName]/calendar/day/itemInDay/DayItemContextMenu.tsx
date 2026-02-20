"use client";
import { useRef, useEffect, FC, useState } from "react";
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

export const DayItemContextMenu: FC<{
  x: number;
  y: number;
  onClose: () => void;
  item: IModuleItem;
  moduleName: string;
}> = ({ x, y, onClose, item, moduleName }) => {
  const { courseName } = useCourseContext();
  const ref = useRef<HTMLDivElement>(null);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setConfirmingDelete(false);
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmingDelete(false);
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleClose = () => {
    setConfirmingDelete(false);
    onClose();
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

  const baseButtonClasses = "unstyled w-full text-left px-4 py-2";
  const normalHoverClasses = "hover:bg-slate-700 disabled:opacity-50";
  const dangerClasses =
    "bg-rose-900/30 hover:bg-rose-950 disabled:opacity-50 text-rose-50";
  return (
    <div
      ref={ref}
      className="
        fixed z-50 bg-slate-900 border-2 border-slate-700
        rounded shadow-xl overflow-hidden
      "
      style={{ left: x, top: y }}
    >
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
                className="unstyled block px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer"
                onClick={handleClose}
              >
                View in Canvas
              </a>
              <button
                onClick={handleUpdateCanvas}
                disabled={updateInCanvas.isPending}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 disabled:opacity-50"
              >
                Update in Canvas
              </button>
              <button
                onClick={handleDeleteFromCanvas}
                disabled={deleteFromCanvas.isPending}
                className={`${baseButtonClasses} ${dangerClasses}`}
              >
                Delete from Canvas
              </button>
            </>
          )}
          {!canvasUrl && (
            <button
              onClick={() => setConfirmingDelete(true)}
              className={`${baseButtonClasses} ${dangerClasses}`}
            >
              Delete from Disk
            </button>
          )}
          <button
            onClick={handleDuplicate}
            className={`${baseButtonClasses} ${normalHoverClasses}`}
          >
            Duplicate
          </button>
        </>
      )}
    </div>
  );
};
