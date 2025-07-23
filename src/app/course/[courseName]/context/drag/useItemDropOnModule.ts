"use client";
import { useUpdatePageMutation } from "@/features/local/pages/pageHooks";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { Dispatch, SetStateAction, useCallback, DragEvent } from "react";
import { DraggableItem } from "./draggingContext";
import { useCourseContext } from "../courseContext";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useUpdateAssignmentMutation } from "@/features/local/assignments/assignmentHooks";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";

export function useItemDropOnModule({
  setIsDragging,
}: {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}) {
  const updateQuizMutation = useUpdateQuizMutation();
  const updateAssignmentMutation = useUpdateAssignmentMutation();
  const updatePageMutation = useUpdatePageMutation();
  const { courseName } = useCourseContext();

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
            quiz,
            quizName: quiz.name,
            moduleName: dropModuleName,
            previousModuleName: itemBeingDragged.sourceModuleName,
            previousQuizName: quiz.name,
            courseName,
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
            assignment,
            previousModuleName: itemBeingDragged.sourceModuleName,
            moduleName: dropModuleName,
            assignmentName: assignment.name,
            previousAssignmentName: assignment.name,
            courseName,
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
            page,
            moduleName: dropModuleName,
            pageName: page.name,
            previousPageName: page.name,
            previousModuleName: itemBeingDragged.sourceModuleName,
            courseName,
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
      courseName,
      setIsDragging,
      updateAssignmentMutation,
      updatePageMutation,
      updateQuizMutation,
    ]
  );
}
