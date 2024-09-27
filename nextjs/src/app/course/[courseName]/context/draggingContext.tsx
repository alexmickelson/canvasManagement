"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { createContext, useContext, DragEvent } from "react";

export interface DraggableItem {
  item: IModuleItem;
  sourceModuleName: string;
  type: "quiz" | "assignment" | "page";
}

export interface DraggingContextInterface {
  itemDropOnDay: (e: DragEvent<HTMLDivElement>, droppedOnDay: string) => void;
  itemDropOnModule: (e: DragEvent<HTMLDivElement>, moduleName: string) => void;
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
