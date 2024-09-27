"use client";
import { ReactNode, useCallback, DragEvent, useEffect } from "react";
import { DraggableItem, DraggingContext } from "./draggingContext";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  getDateFromStringOrThrow,
  dateToMarkdownString,
} from "@/models/local/timeUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { useUpdateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import { useUpdatePageMutation } from "@/hooks/localCourse/pageHooks";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useDragStyleContext } from "./dragStyleContext";

export default function DraggingContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { setIsDragging } = useDragStyleContext();
  const updateQuizMutation = useUpdateQuizMutation();
  const updateAssignmentMutation = useUpdateAssignmentMutation();
  const updatePageMutation = useUpdatePageMutation();
  const { data: settings } = useLocalCourseSettingsQuery();

  useEffect(() => {
    const handleDrop = () => {
      console.log("drop on window");
      setIsDragging(false);
    };
    const preventDefault = (e: globalThis.DragEvent) => e.preventDefault();
    if (typeof window !== "undefined") {
      window.addEventListener("drop", handleDrop);
      window.addEventListener("dragover", preventDefault);
    }
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.addEventListener("dragover", preventDefault);
    };
  }, [setIsDragging]);

  const itemDropOnModule = useCallback(
    (e: DragEvent<HTMLDivElement>, dropModuleName: string) => {
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
        }
      }
      setIsDragging(false);

      function updateQuiz() {
        const quiz = itemBeingDragged.item as LocalQuiz;

        updateQuizMutation.mutate({
          item: quiz,
          itemName: quiz.name,
          moduleName: dropModuleName,
          previousModuleName: itemBeingDragged.sourceModuleName,
          previousItemName: quiz.name,
        });
      }
      function updateAssignment() {
        const assignment = itemBeingDragged.item as LocalAssignment;
        updateAssignmentMutation.mutate({
          item: assignment,
          previousModuleName: itemBeingDragged.sourceModuleName,
          moduleName: dropModuleName,
          itemName: assignment.name,
          previousItemName: assignment.name,
        });
      }
      function updatePage() {
        const page = itemBeingDragged.item as LocalCoursePage;
        updatePageMutation.mutate({
          item: page,
          moduleName: dropModuleName,
          itemName: page.name,
          previousItemName: page.name,
          previousModuleName: itemBeingDragged.sourceModuleName,
        });
      }
    },
    [
      setIsDragging,
      updateAssignmentMutation,
      updatePageMutation,
      updateQuizMutation,
    ]
  );

  const itemDropOnDay = useCallback(
    (e: DragEvent<HTMLDivElement>, day: string) => {
      const rawData = e.dataTransfer.getData("draggableItem");
      if (!rawData) return;
      const itemBeingDragged: DraggableItem = JSON.parse(rawData);

      if (itemBeingDragged) {
        const dayAsDate = getDateWithDefaultDueTime();
        if (itemBeingDragged.type === "quiz") {
          updateQuiz(dayAsDate);
        } else if (itemBeingDragged.type === "assignment") {
          updateAssignment(dayAsDate);
        } else if (itemBeingDragged.type === "page") {
          updatePage(dayAsDate);
        }
      }
      setIsDragging(false);

      function getDateWithDefaultDueTime() {
        const dayAsDate = getDateFromStringOrThrow(day, "in drop callback");
        dayAsDate.setHours(settings.defaultDueTime.hour);
        dayAsDate.setMinutes(settings.defaultDueTime.minute);
        dayAsDate.setSeconds(0);
        return dayAsDate;
      }
      function updateQuiz(dayAsDate: Date) {
        const previousQuiz = itemBeingDragged.item as LocalQuiz;

        const quiz: LocalQuiz = {
          ...previousQuiz,
          dueAt: dateToMarkdownString(dayAsDate),
          lockAt: getLaterDate(previousQuiz.lockAt, dayAsDate),
        };
        updateQuizMutation.mutate({
          item: quiz,
          itemName: quiz.name,
          moduleName: itemBeingDragged.sourceModuleName,
          previousModuleName: itemBeingDragged.sourceModuleName,
          previousItemName: quiz.name,
        });
      }
      function updatePage(dayAsDate: Date) {
        const previousPage = itemBeingDragged.item as LocalCoursePage;
        const page: LocalCoursePage = {
          ...previousPage,
          dueAt: dateToMarkdownString(dayAsDate),
        };
        updatePageMutation.mutate({
          item: page,
          moduleName: itemBeingDragged.sourceModuleName,
          itemName: page.name,
          previousItemName: page.name,
          previousModuleName: itemBeingDragged.sourceModuleName,
        });
      }
      function updateAssignment(dayAsDate: Date) {
        const previousAssignment = itemBeingDragged.item as LocalAssignment;
        const assignment: LocalAssignment = {
          ...previousAssignment,
          dueAt: dateToMarkdownString(dayAsDate),
          lockAt:
            previousAssignment.lockAt &&
            (getDateFromStringOrThrow(
              previousAssignment.lockAt,
              "lockAt date"
            ) > dayAsDate
              ? previousAssignment.lockAt
              : dateToMarkdownString(dayAsDate)),
        };
        updateAssignmentMutation.mutate({
          item: assignment,
          previousModuleName: itemBeingDragged.sourceModuleName,
          moduleName: itemBeingDragged.sourceModuleName,
          itemName: assignment.name,
          previousItemName: assignment.name,
        });
      }
    },
    [
      setIsDragging,
      settings.defaultDueTime.hour,
      settings.defaultDueTime.minute,
      updateAssignmentMutation,
      updatePageMutation,
      updateQuizMutation,
    ]
  );

  return (
    <DraggingContext.Provider
      value={{
        itemDropOnDay,
        itemDropOnModule,
      }}
    >
      {children}
    </DraggingContext.Provider>
  );
}
function getLaterDate(
  firstDate: string | undefined,
  dayAsDate: Date
): string | undefined {
  return (
    firstDate &&
    (getDateFromStringOrThrow(firstDate, "lockAt date") > dayAsDate
      ? firstDate
      : dateToMarkdownString(dayAsDate))
  );
}
