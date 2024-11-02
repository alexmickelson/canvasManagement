"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { createContext, useContext, DragEvent } from "react";

export interface DraggableItem {
  item: IModuleItem;
  sourceModuleName: string | undefined; // undefined for lectures
  type: "quiz" | "assignment" | "page" | "lecture";
}

export interface DraggingContextInterface {
  itemDropOnDay: (e: DragEvent, droppedOnDay: string) => void;
  itemDropOnModule: (e: DragEvent, moduleName: string) => void;
}
const defaultDraggingValue: DraggingContextInterface = {
  itemDropOnDay: () => {},
  itemDropOnModule: () => {},
};
export const DraggingContext =
  createContext<DraggingContextInterface>(defaultDraggingValue);

export function useDraggingContext() {
  return useContext(DraggingContext);
}
