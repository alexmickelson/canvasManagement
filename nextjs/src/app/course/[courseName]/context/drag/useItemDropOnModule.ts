"use client";
import { useUpdateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import { useUpdatePageMutation } from "@/hooks/localCourse/pageHooks";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { Dispatch, SetStateAction, useCallback, DragEvent } from "react";
import { DraggableItem } from "./draggingContext";
import { useUpdateItemMutation } from "@/hooks/localCourse/courseItemHooks";

export function useItemDropOnModule({
  setIsDragging,
}: {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}) {
  const updateQuizMutation = useUpdateItemMutation("Quiz");
  const updateAssignmentMutation = useUpdateAssignmentMutation();
  const updatePageMutation = useUpdatePageMutation();

  return useCallback(
    (e: DragEvent, dropModuleName: string) => {
      console.log("dropping on module");
      const rawData = e.dataTransfer.getData("draggableItem");
      if (!rawData) return;
      const itemBeingDragged: DraggableItem = JSON.parse(rawData);

      if (itemBeingDragged) {
        if (itemBeingDragged.type === "quiz") {
          updateQuiz();
        } else if (itemBeingDragged.type === "assignment") {
          updateAssignment();
        } else if (itemBeingDragged.type === "page") {
          updatePage();
        } else if (itemBeingDragged.type === "lecture") {
          console.log("cannot drop lecture on module, only on days");
        }
      }
      setIsDragging(false);

      function updateQuiz() {
        const quiz = itemBeingDragged.item as LocalQuiz;
        if (itemBeingDragged.sourceModuleName) {
          updateQuizMutation.mutate({
            item: quiz,
            itemName: quiz.name,
            moduleName: dropModuleName,
            previousModuleName: itemBeingDragged.sourceModuleName,
            previousItemName: quiz.name,
          });
        } else {
          console.error(
            `error dropping quiz, sourceModuleName is undefined `,
            quiz
          );
        }
      }
      function updateAssignment() {
        const assignment = itemBeingDragged.item as LocalAssignment;
        if (itemBeingDragged.sourceModuleName) {
          updateAssignmentMutation.mutate({
            item: assignment,
            previousModuleName: itemBeingDragged.sourceModuleName,
            moduleName: dropModuleName,
            itemName: assignment.name,
            previousItemName: assignment.name,
          });
        } else {
          console.error(
            `error dropping assignment, sourceModuleName is undefined `,
            assignment
          );
        }
      }
      function updatePage() {
        const page = itemBeingDragged.item as LocalCoursePage;
        if (itemBeingDragged.sourceModuleName) {
          updatePageMutation.mutate({
            item: page,
            moduleName: dropModuleName,
            itemName: page.name,
            previousItemName: page.name,
            previousModuleName: itemBeingDragged.sourceModuleName,
          });
        } else {
          console.error(
            `error dropping page, sourceModuleName is undefined `,
            page
          );
        }
      }
    },
    [
      setIsDragging,
      updateAssignmentMutation,
      updatePageMutation,
      updateQuizMutation,
    ]
  );
}
