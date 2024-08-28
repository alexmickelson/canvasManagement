"use client";
import { ReactNode, useState } from "react";
import { CourseContext, DraggableItem } from "./courseContext";
import {
  useLocalCourseDetailsQuery,
  useUpdateCourseMutation,
} from "@/hooks/localCoursesHooks";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { LocalCourse } from "@/models/local/localCourse";
import { dateToMarkdownString } from "@/models/local/timeUtils";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const { data: course } = useLocalCourseDetailsQuery(localCourseName);
  const updateCourseMutation = useUpdateCourseMutation(course.settings.name);
  const [itemBeingDragged, setItemBeingDragged] = useState<
    DraggableItem | undefined
  >();

  return (
    <CourseContext.Provider
      value={{
        localCourse: course,
        startItemDrag: (d) => {
          console.log("starting drag");
          setItemBeingDragged(d);
        },
        endItemDrag: () => {
          console.log("stopping drag");
          setItemBeingDragged(undefined);
        },
        itemDrop: (day) => {
          console.log("dropping");
          if (itemBeingDragged && day) {
            if (itemBeingDragged.type === "quiz") {
              const updatedQuiz: LocalQuiz = {
                ...(itemBeingDragged.item as LocalQuiz),
                dueAt: dateToMarkdownString(day),
              };

              const localModule = course.modules.find((m) =>
                m.quizzes.map((q) => q.name).includes(updatedQuiz.name)
              );
              if (!localModule)
                console.log("could not find module for quiz ", updatedQuiz);

              const updatedCourse: LocalCourse = {
                ...course,
                modules: course.modules.map((m) =>
                  m.name !== localModule?.name
                    ? m
                    : {
                        ...m,
                        quizzes: m.quizzes.map((q) =>
                          q.name === updatedQuiz.name ? updatedQuiz : q
                        ),
                      }
                ),
              };
              updateCourseMutation.mutate({
                updatedCourse,
                previousCourse: course,
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
