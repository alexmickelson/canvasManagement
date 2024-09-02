"use client";
import { ReactNode, useCallback, DragEvent } from "react";
import { DraggingContext } from "./draggingContext";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { getDateFromStringOrThrow, dateToMarkdownString } from "@/models/local/timeUtils";

export default function DraggingContextProvider({
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const updateQuizMutation = useUpdateQuizMutation();
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
            lockAt:
              previousQuiz.lockAt &&
              (getDateFromStringOrThrow(previousQuiz.lockAt, "lockAt date") >
              dayAsDate
                ? previousQuiz.lockAt
                : dateToMarkdownString(dayAsDate)),
          };
          updateQuizMutation.mutate({
            quiz: quiz,
            quizName: quiz.name,
            moduleName: itemBeingDragged.sourceModuleName,
          });
        } else if (itemBeingDragged.type === "assignment") {
          console.log("dropped assignment");
        } else if (itemBeingDragged.type === "page") {
          console.log("dropped page");
        }
      }
    },
    [
      settings.defaultDueTime.hour,
      settings.defaultDueTime.minute,
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
