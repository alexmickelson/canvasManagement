"use client";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
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
export const DraggingContext =
  createContext<DraggingContextInterface>({
  itemDropOnDay: () => {},
  itemDropOnModule: () => {},
});

export function useDraggingContext() {
  return useContext(DraggingContext);
}
