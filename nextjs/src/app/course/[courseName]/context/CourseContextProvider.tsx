"use client";
import { ReactNode, useCallback, useState } from "react";
import { CourseContext, DraggableItem } from "./courseContext";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { dateToMarkdownString } from "@/models/local/timeUtils";
import { useUpdateQuizMutation } from "@/hooks/localCourse/quizHooks";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const updateQuizMutation = useUpdateQuizMutation(localCourseName);
  const [itemBeingDragged, setItemBeingDragged] = useState<
    DraggableItem | undefined
  >();

  const itemDrop = useCallback(
    (day: Date | undefined) => {
      if (itemBeingDragged && day) {
        if (itemBeingDragged.type === "quiz") {
          const quiz: LocalQuiz = {
            ...(itemBeingDragged.item as LocalQuiz),
            dueAt: dateToMarkdownString(day),
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
    [itemBeingDragged, updateQuizMutation]
  );

  return (
    <CourseContext.Provider
      value={{
        courseName: localCourseName,
        startItemDrag: (d) => {
          setItemBeingDragged(d);
        },
        endItemDrag: () => {
          setItemBeingDragged(undefined);
        },
        itemDrop,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
