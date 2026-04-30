"use client";
import { useEffect, FC, useState } from "react";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import TextInput from "@/components/form/TextInput";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useUpdatePageMutation,
} from "@/features/local/pages/pageHooks";
import {
  useCanvasPagesQuery,
  useCreateCanvasPageMutation,
  useDeleteCanvasPageMutation,
  canvasPageKeys,
} from "@/features/canvas/hooks/canvasPageHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { baseCanvasUrl } from "@/features/canvas/services/canvasServiceUtils";
import { useCourseContext } from "../../../context/courseContext";
import { useCalendarItemsContext } from "../../../context/calendarItemsContext";
import Modal, { ModalControl } from "@/components/Modal";
import { useQueryClient } from "@tanstack/react-query";

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

export const PageDayItemContextMenu: FC<{
  modalControl: ModalControl;
  item: IModuleItem;
  moduleName: string;
}> = ({ modalControl, item, moduleName }) => {
  const queryClient = useQueryClient();
  const { courseName } = useCourseContext();
  const calendarItems = useCalendarItemsContext();
  const createPageMutation = useCreatePageMutation();
  const deleteLocalMutation = useDeletePageMutation();
  const addToCanvasMutation = useCreateCanvasPageMutation();
  const deleteFromCanvasMutation = useDeleteCanvasPageMutation();
  const { data: canvasPages } = useCanvasPagesQuery();
  const { data: settings } = useLocalCourseSettingsQuery();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const updatePageMutation = useUpdatePageMutation();

  const pageInCanvas = canvasPages?.find((p) => p.title === item.name);

  const canvasUrl = pageInCanvas
    ? `${baseCanvasUrl}/courses/${settings.canvasId}/pages/${pageInCanvas.url}`
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
    for (let i = 1; i <= 8; i += 2) {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
        });
      }, i * 1000);
    }
    setConfirmingDelete(false);
    setRenaming(false);
    modalControl.closeModal();
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName === item.name) {
      handleClose();
      return;
    }
    const page = item as LocalCoursePage;
    await updatePageMutation.mutateAsync({
      page: { ...page, name: newName },
      moduleName,
      pageName: newName,
      previousModuleName: moduleName,
      previousPageName: item.name,
      courseName,
    });
    handleClose();
  };

  const handleDelete = () => {
    deleteLocalMutation.mutate({
      courseName,
      moduleName,
      pageName: item.name,
    });
    handleClose();
  };

  const handleDeleteFromCanvas = () => {
    if (pageInCanvas) {
      deleteFromCanvasMutation.mutate(pageInCanvas.page_id);
      handleClose();
    }
  };

  const handleAddToCanvas = () => {
    addToCanvasMutation.mutate({
      page: item as LocalCoursePage,
      moduleName,
    });
    handleClose();
  };

  const handleDuplicate = () => {
    const page = item as LocalCoursePage;
    const existingNames = Object.values(calendarItems).flatMap((modules) =>
      (modules[moduleName]?.pages ?? []).map((p) => p.name),
    );
    const duplicateName = getDuplicateName(item.name, existingNames);
    createPageMutation.mutate({
      courseName,
      moduleName,
      pageName: duplicateName,
      page: { ...page, name: duplicateName },
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
                <div className={``}>Delete from disk?</div>
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
            ) : renaming ? (
              <form onSubmit={handleRename} className="flex flex-col gap-2">
                <TextInput
                  value={newName}
                  setValue={setNewName}
                  label="New Name"
                />
                <button
                  type="button"
                  onClick={() => setRenaming(false)}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePageMutation.isPending || !newName.trim()}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Save
                </button>
              </form>
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
                <button
                  onClick={() => {
                    setNewName(item.name);
                    setRenaming(true);
                  }}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Rename
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
