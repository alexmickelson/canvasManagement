"use client";

import { useUpdateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import {
  useLecturesByWeekQuery,
  useLectureUpdateMutation,
} from "@/hooks/localCourse/lectureHooks";
import { useUpdatePageMutation } from "@/hooks/localCourse/pageHooks";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { Lecture } from "@/models/local/lecture";
import { getLectureForDay } from "@/models/local/lectureUtils";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
  dateToMarkdownString,
} from "@/models/local/timeUtils";
import { Dispatch, SetStateAction, useCallback, DragEvent } from "react";
import { DraggableItem } from "./draggingContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";

export function useItemDropOnDay({
  setIsDragging,
  setModalText,
  setModalCallback,
  setIsLoading,
  modal,
}: {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  setModalText: Dispatch<SetStateAction<string>>;
  setModalCallback: Dispatch<SetStateAction<() => void>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  modal: { isOpen: boolean; openModal: () => void; closeModal: () => void };
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: weeks } = useLecturesByWeekQuery();
  const updateQuizMutation = useUpdateQuizMutation();
  const updateLectureMutation = useLectureUpdateMutation();
  const updateAssignmentMutation = useUpdateAssignmentMutation();
  const updatePageMutation = useUpdatePageMutation();
  return useCallback(
    (e: DragEvent, day: string) => {
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
        } else if (itemBeingDragged.type === "lecture") {
          updateLecture(dayAsDate);
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
      function updateLecture(dayAsDate: Date) {
        const { dueAt, ...lecture } = itemBeingDragged.item as Lecture & {
          dueAt: string;
        };
        console.log("dropped lecture on day");
        const existingLecture = getLectureForDay(weeks, dayAsDate);
        if (existingLecture) {
          console.log("attempting to drop on existing lecture");
          setModalText(
            `Are you sure you want to replace ${existingLecture?.name} with ${lecture.name}? This will delete ${existingLecture.name}.`
          );

          setModalCallback(() => async () => {
            // because sometimes setStates receive a function
            console.log("running callback");
            setIsLoading(true);
            await updateLectureMutation.mutateAsync({
              previousDay: lecture.date,
              lecture: {
                ...lecture,
                date: getDateOnlyMarkdownString(dayAsDate),
              },
            });
            setModalText("");
            setModalCallback(() => {});
            modal.closeModal();
            setIsLoading(false);
          });
          modal.openModal();
        } else {
          console.log("updating lecture on unique day");
          updateLectureMutation.mutate({
            previousDay: lecture.date,
            lecture: {
              ...lecture,
              date: getDateOnlyMarkdownString(dayAsDate),
            },
          });
        }
      }
      function updateQuiz(dayAsDate: Date) {
        const previousQuiz = itemBeingDragged.item as LocalQuiz;
        if (!itemBeingDragged.sourceModuleName) {
          console.error(
            "error dropping quiz on day, sourceModuleName is undefined"
          );
          return;
        }

        const quiz: LocalQuiz = {
          ...previousQuiz,
          dueAt: dateToMarkdownString(dayAsDate),
          lockAt: getNewLockDate(
            previousQuiz.dueAt,
            previousQuiz.lockAt,
            dayAsDate
          ),
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
        if (!itemBeingDragged.sourceModuleName) {
          console.error(
            "error dropping page on day, sourceModuleName is undefined"
          );
          return;
        }
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
        if (!itemBeingDragged.sourceModuleName) {
          console.error(
            "error dropping assignment on day, sourceModuleName is undefined"
          );
          return;
        }
        const previousAssignment = itemBeingDragged.item as LocalAssignment;
        const assignment: LocalAssignment = {
          ...previousAssignment,
          dueAt: dateToMarkdownString(dayAsDate),
          lockAt: getNewLockDate(
            previousAssignment.dueAt,
            previousAssignment.lockAt,
            dayAsDate
          ),
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
      modal,
      setIsDragging,
      setIsLoading,
      setModalCallback,
      setModalText,
      settings.defaultDueTime.hour,
      settings.defaultDueTime.minute,
      updateAssignmentMutation,
      updateLectureMutation,
      updatePageMutation,
      updateQuizMutation,
      weeks,
    ]
  );
}
export function useItemDropOnModule({
  setIsDragging,
}: {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}) {
  const updateQuizMutation = useUpdateQuizMutation();
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
export function getNewLockDate(
  originalDueDate: string,
  originalLockDate: string | undefined,
  dayAsDate: Date
): string | undefined {
  // todo: preserve previous due date / lock date offset
  const dueDate = getDateFromStringOrThrow(originalDueDate, "dueAt date");
  const lockDate =
    originalLockDate === undefined
      ? undefined
      : getDateFromStringOrThrow(originalLockDate, "lockAt date");

  const originalOffset =
    lockDate === undefined ? undefined : lockDate.getTime() - dueDate.getTime();

  const newLockDate =
    originalOffset === undefined
      ? undefined
      : new Date(dayAsDate.getTime() + originalOffset);

  return newLockDate === undefined
    ? undefined
    : dateToMarkdownString(newLockDate);
}
