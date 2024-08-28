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
  startModuleDrag: (dragging: DraggableItem) => void;
  stopModuleDrag: (droppedOnDay?: Date) => void;
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
  startModuleDrag: () => { },
  stopModuleDrag: function (droppedOnDay?: Date): void {
    throw new Error("Function not implemented.");
  }
};

export const CourseContext =
  createContext<CourseContextInterface>(defaultValue);

export function useCourseContext() {
  return useContext(CourseContext);
}
