"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  Dispatch,
} from "react";

export interface DraggingStyleContextInterface {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}
const defaultDraggingValue: DraggingStyleContextInterface = {
  setIsDragging: () => {},
};
export const DragStyleContext =
  createContext<DraggingStyleContextInterface>(defaultDraggingValue);

export function useDragStyleContext() {
  return useContext(DragStyleContext);
}

export function DragStyleContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <DragStyleContext.Provider value={{ setIsDragging }}>
      <div
        className={"min-h-0 flex flex-col " + (isDragging ? " dragging " : "")}
      >
        {children}
      </div>
    </DragStyleContext.Provider>
  );
}
