"use client";
import { IModuleItem } from "@/models/local/IModuleItem";
import { createContext, useContext } from "react";

export interface DraggableItem {
  item: IModuleItem;
  sourceModuleName: string;
  type: "quiz" | "assignment" | "page";
}

export interface DraggingContextInterface {
  startItemDrag: (dragging: DraggableItem) => void;
  endItemDrag: () => void;
  itemDrop: (droppedOnDay?: string) => void;
}
const defaultDraggingValue: DraggingContextInterface = {
  startItemDrag: () => { },
  endItemDrag: () => { },
  itemDrop: () => { },
};
export const DraggingContext = createContext<DraggingContextInterface>(defaultDraggingValue);

export function useDraggingContext() {
  return useContext(DraggingContext);
}
