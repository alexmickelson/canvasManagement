"use client";
import { ReactNode, useCallback, DragEvent } from "react";
import { DraggingContext } from "./draggingContext";
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

export default function DraggingContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const updateQuizMutation = useUpdateQuizMutation();
  const updateAssignmentMutation = useUpdateAssignmentMutation();
  const updatePageMutation = useUpdatePageMutation();
  const { data: settings } = useLocalCourseSettingsQuery();

  const itemDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, day: string | undefined) => {
      const itemBeingDragged = JSON.parse(
        e.dataTransfer.getData("draggableItem")
      );

      if (itemBeingDragged && day) {
        const dayAsDate = getDateFromStringOrThrow(day, "in drop callback");
        dayAsDate.setHours(settings.defaultDueTime.hour);
        dayAsDate.setMinutes(settings.defaultDueTime.minute);
        dayAsDate.setSeconds(0);

        console.log("dropped on day", dayAsDate, day);
        if (itemBeingDragged.type === "quiz") {
          console.log("dropping quiz");
          const previousQuiz = itemBeingDragged.item as LocalQuiz;

          const quiz: LocalQuiz = {
            ...previousQuiz,
            dueAt: dateToMarkdownString(dayAsDate),
            lockAt: getLaterDate(previousQuiz.lockAt, dayAsDate),
          };
          updateQuizMutation.mutate({
            quiz: quiz,
            quizName: quiz.name,
            moduleName: itemBeingDragged.sourceModuleName,
          });
        } else if (itemBeingDragged.type === "assignment") {
          updateAssignment(dayAsDate);
        } else if (itemBeingDragged.type === "page") {
          console.log("dropped page");
          const previousPage = itemBeingDragged.item as LocalCoursePage;
          const page: LocalCoursePage = {
            ...previousPage,
            dueAt: dateToMarkdownString(dayAsDate),
          };
          updatePageMutation.mutate({
            page,
            moduleName: itemBeingDragged.sourceModuleName,
            pageName: page.name,
          });
        }
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
          assignment,
          moduleName: itemBeingDragged.sourceModuleName,
          assignmentName: assignment.name,
        });
      }
    },
    [
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
        itemDrop,
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
