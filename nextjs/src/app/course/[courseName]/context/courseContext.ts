"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { createContext, useContext } from "react";

export interface DraggableItem {
  item: IModuleItem;
  type: "quiz" | "assignment" | "page";
}

export interface CourseContextInterface {
  courseName: string;
  startItemDrag: (dragging: DraggableItem) => void;
  endItemDrag: () => void;
  itemDrop: (droppedOnDay?: Date) => void;
}

const defaultValue: CourseContextInterface = {
  startItemDrag: () => { },
  endItemDrag: () => { },
  itemDrop: () => { },
  courseName: ""
};

export const CourseContext =
  createContext<CourseContextInterface>(defaultValue);

export function useCourseContext() {
  return useContext(CourseContext);
}
