"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { LocalCourse } from "@/models/local/localCourse";
import { createContext, useContext } from "react";

export interface DraggableItem {
  item: IModuleItem;
  type: "quiz" | "assignment" | "page";
}

export interface CourseContextInterface {
  localCourse: LocalCourse;
  startItemDrag: (dragging: DraggableItem) => void;
  endItemDrag: () => void;
  itemDrop: (droppedOnDay?: Date) => void;
}

const defaultValue: CourseContextInterface = {
  localCourse: {
    modules: [],
    settings: {
      name: "",
      assignmentGroups: [],
      daysOfWeek: [],
      startDate: "",
      endDate: "",
      defaultDueTime: {
        hour: 0,
        minute: 0,
      },
    },
  },
  startItemDrag: () => {},
  endItemDrag: () => {},
  itemDrop: () => {},
};

export const CourseContext =
  createContext<CourseContextInterface>(defaultValue);

export function useCourseContext() {
  return useContext(CourseContext);
}
