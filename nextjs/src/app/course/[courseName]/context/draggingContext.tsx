"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { createContext, useContext, DragEvent } from "react";

export interface DraggableItem {
  item: IModuleItem;
  sourceModuleName: string;
  type: "quiz" | "assignment" | "page";
}

export interface DraggingContextInterface {
  itemDrop: (e: DragEvent<HTMLDivElement>, droppedOnDay?: string) => void;
  isDragging: boolean;
  dragStart: () => void;
}
const defaultDraggingValue: DraggingContextInterface = {
  itemDrop: () => {},
  isDragging: false,
  dragStart: () => {},
};
export const DraggingContext =
  createContext<DraggingContextInterface>(defaultDraggingValue);

export function useDraggingContext() {
  return useContext(DraggingContext);
}
