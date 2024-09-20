import React, { ReactNode } from "react";
import { useDraggingContext } from "../context/draggingContext";

export default function DropTargetStyling({
  children,
  draggingClassName,
}: {
  children: ReactNode;
  draggingClassName: string;
}) {
  const { isDragging } = useDraggingContext();
  return (
    <div
      className={
        "h-full transition-all duration-500  " +
        (isDragging ? draggingClassName : "")
      }
    >
      {children}
    </div>
  );
}
