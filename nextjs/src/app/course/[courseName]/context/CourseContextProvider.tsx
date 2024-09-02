"use client";
import { ReactNode, useCallback, useState } from "react";
import { CourseContext } from "./courseContext";
import { DraggableItem } from "./DraggingContext";
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
  return (
    <CourseContext.Provider
      value={{
        courseName: localCourseName,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
