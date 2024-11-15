"use client";
import { useUpdateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import {
  useLecturesSuspenseQuery,
  useLectureUpdateMutation,
} from "@/hooks/localCourse/lectureHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useUpdatePageMutation } from "@/hooks/localCourse/pageHooks";
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
import { getNewLockDate } from "./getNewLockDate";
import { trpc } from "@/services/serverFunctions/trpcClient";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useCourseContext } from "../courseContext";

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
  const [settings] = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  // const { data: weeks } = useLecturesByWeekQuery();
  const [weeks] = useLecturesSuspenseQuery();
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
            `Are you sure you want to replace ${
              existingLecture?.name || "Un-named Lecture"
            } with ${lecture.name}? This will delete ${
              existingLecture?.name || "Un-named Lecture"
            }.`
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
              courseName,
              settings,
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
            courseName,
            settings,
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
          quiz,
          quizName: quiz.name,
          moduleName: itemBeingDragged.sourceModuleName,
          previousModuleName: itemBeingDragged.sourceModuleName,
          previousQuizName: quiz.name,
          courseName: settings.name,
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
          page,
          moduleName: itemBeingDragged.sourceModuleName,
          pageName: page.name,
          previousPageName: page.name,
          previousModuleName: itemBeingDragged.sourceModuleName,
          courseName: settings.name,
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
          assignment,
          previousModuleName: itemBeingDragged.sourceModuleName,
          moduleName: itemBeingDragged.sourceModuleName,
          assignmentName: assignment.name,
          previousAssignmentName: assignment.name,
          courseName: settings.name,
        });
      }
    },
    [
      courseName,
      modal,
      setIsDragging,
      setIsLoading,
      setModalCallback,
      setModalText,
      settings,
      updateAssignmentMutation,
      updateLectureMutation,
      updatePageMutation,
      updateQuizMutation,
      weeks,
    ]
  );
}
