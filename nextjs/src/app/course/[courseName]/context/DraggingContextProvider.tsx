"use client";
import { ReactNode, useCallback, useState } from "react";
import { DraggableItem, DraggingContext } from "./DraggingContext";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/timeUtils";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";

export default function DraggingContextProvider({
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const updateQuizMutation = useUpdateQuizMutation();
  const { data: settings } = useLocalCourseSettingsQuery();
  const [itemBeingDragged, setItemBeingDragged] = useState<
    DraggableItem | undefined
  >();

  const itemDrop = useCallback(
    (day: string | undefined) => {
      if (itemBeingDragged && day) {
        const dayAsDate = getDateFromStringOrThrow(day, "in drop callback");
        dayAsDate.setHours(settings.defaultDueTime.hour);
        dayAsDate.setHours(settings.defaultDueTime.minute);
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
      setItemBeingDragged(undefined);
    },
    [
      itemBeingDragged,
      settings.defaultDueTime.hour,
      settings.defaultDueTime.minute,
      updateQuizMutation,
    ]
  );

  const startItemDrag = useCallback((d: DraggableItem) => {
    setItemBeingDragged(d);
  }, []);
  const endItemDrag = useCallback(() => {
    setItemBeingDragged(undefined);
  }, []);
  return (
    <DraggingContext.Provider
      value={{
        startItemDrag: startItemDrag,
        endItemDrag: endItemDrag,
        itemDrop,
      }}
    >
      {children}
    </DraggingContext.Provider>
  );
}
