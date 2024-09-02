"use client";
import { ReactNode, useCallback, useState } from "react";
import { CourseContext, DraggableItem } from "./courseContext";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/timeUtils";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const updateQuizMutation = useUpdateQuizMutation(localCourseName);
  const { data: settings } = useLocalCourseSettingsQuery(localCourseName);
  const [itemBeingDragged, setItemBeingDragged] = useState<
    DraggableItem | undefined
  >();

  const itemDrop = useCallback(
    (day: Date | undefined) => {
      if (itemBeingDragged && day) {
        day.setHours(settings.defaultDueTime.hour);
        day.setHours(settings.defaultDueTime.minute);
        if (itemBeingDragged.type === "quiz") {
          const previousQuiz = itemBeingDragged.item as LocalQuiz;

          const quiz: LocalQuiz = {
            ...previousQuiz,
            dueAt: dateToMarkdownString(day),
            lockAt:
              previousQuiz.lockAt &&
              (getDateFromStringOrThrow(previousQuiz.lockAt, "lockAt date") >
              day
                ? previousQuiz.lockAt
                : dateToMarkdownString(day)),
          };
          updateQuizMutation.mutate({
            quiz: quiz,
            quizName: quiz.name,
            moduleName: itemBeingDragged.sourceModuleName,
          });
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
    <CourseContext.Provider
      value={{
        courseName: localCourseName,
        startItemDrag: startItemDrag,
        endItemDrag: endItemDrag,
        itemDrop,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
