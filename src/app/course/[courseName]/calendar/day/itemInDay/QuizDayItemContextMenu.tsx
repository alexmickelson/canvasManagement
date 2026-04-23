"use client";
import { FC, useState } from "react";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { useCalendarItemsContext } from "../../../context/calendarItemsContext";
import TextInput from "@/components/form/TextInput";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
} from "@/features/local/quizzes/quizHooks";
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

export const QuizDayItemContextMenu: FC<{
  modalControl: ModalControl;
  item: IModuleItem;
  moduleName: string;
}> = ({ modalControl, item, moduleName }) => {
  const { courseName } = useCourseContext();
  const calendarItems = useCalendarItemsContext();
  const createQuizMutation = useCreateQuizMutation();
  const updateQuizMutation = useUpdateQuizMutation();

  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleClose = () => {
    setRenaming(false);
    modalControl.closeModal();
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName === item.name) {
      handleClose();
      return;
    }
    const quiz = item as LocalQuiz;
    await updateQuizMutation.mutateAsync({
      quiz: { ...quiz, name: newName },
      moduleName,
      quizName: newName,
      previousModuleName: moduleName,
      previousQuizName: item.name,
      courseName,
    });
    handleClose();
  };

  const handleDuplicate = () => {
    const quiz = item as LocalQuiz;
    const existingNames = Object.values(calendarItems).flatMap((modules) =>
      (modules[moduleName]?.quizzes ?? []).map((q) => q.name),
    );
    const duplicateName = getDuplicateName(item.name, existingNames);
    createQuizMutation.mutate({
      courseName,
      moduleName,
      quizName: duplicateName,
      quiz: { ...quiz, name: duplicateName },
    });
    handleClose();
  };

  const baseButtonClasses = " font-bold text-left py-1";
  const normalButtonClass =
    "hover:bg-blue-900   disabled:opacity-50 bg-blue-900/50 text-blue-50 border border-blue-800/70 rounded ";

  return (
    <Modal modalControl={modalControl} backgroundCoverColor="bg-black/30">
      {() => (
        <div className="p-2">
          <div className="text-center p-1 text-slate-200 ">{item.name}</div>
          <div className="flex flex-col gap-2">
            {renaming ? (
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
                  disabled={updateQuizMutation.isPending || !newName.trim()}
                  className={`unstyled ${baseButtonClasses} ${normalButtonClass}`}
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={handleDuplicate}
                  disabled={createQuizMutation.isPending}
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
