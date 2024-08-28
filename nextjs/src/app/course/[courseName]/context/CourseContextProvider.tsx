"use client";
import { ReactNode, useState } from "react";
import { CourseContext, DraggableItem } from "./courseContext";
import { useLocalCourseDetailsQuery } from "@/hooks/localCoursesHooks";

export default function CourseContextProvider({
  localCourseName,
  children,
}: {
  children: ReactNode;
  localCourseName: string;
}) {
  const { data: course } = useLocalCourseDetailsQuery(localCourseName);
  const [itemBeingDragged, setItemBeingDragged] = useState<
    DraggableItem | undefined
  >();
  return (
    <CourseContext.Provider
      value={{
        localCourse: course,
        startModuleDrag: (d) => setItemBeingDragged(d),
        stopModuleDrag: (day) => setItemBeingDragged(undefined),
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
