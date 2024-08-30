"use client";
import { ReactNode, useState } from "react";
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

  const updateQuiz = (day: Date) => {
    if (!itemBeingDragged) return;

    const updatedQuiz: LocalQuiz = {
      ...(itemBeingDragged.item as LocalQuiz),
      dueAt: dateToMarkdownString(day),
    };

    // const localModule = course.modules.find((m) =>
    //   m.quizzes.map((q) => q.name).includes(updatedQuiz.name)
    // );
    // if (!localModule)
    //   console.log("could not find module for quiz ", updatedQuiz);

    // const updatedCourse: LocalCourse = {
    //   ...course,
    //   modules: course.modules.map((m) =>
    //     m.name !== localModule?.name
    //       ? m
    //       : {
    //           ...m,
    //           quizzes: m.quizzes.map((q) =>
    //             q.name === updatedQuiz.name ? updatedQuiz : q
    //           ),
    //         }
    //   ),
    // };
    // updateCourseMutation.mutate({
    //   updatedCourse,
    //   previousCourse: course,
    // });
  };
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
        itemDrop: (day) => {
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
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
