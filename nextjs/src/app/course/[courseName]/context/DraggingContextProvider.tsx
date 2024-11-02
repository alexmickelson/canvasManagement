"use client";
import { ReactNode, useEffect, useState } from "react";
import { DraggingContext } from "./draggingContext";
import { useDragStyleContext } from "./dragStyleContext";
import { useModal } from "@/components/Modal";
import { LectureReplaceModal } from "./LectureReplaceModal";
import { useItemDropOnDay, useItemDropOnModule } from "./draggingContextUtils";

export default function DraggingContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { setIsDragging } = useDragStyleContext();
  const [isLoading, setIsLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const modal = useModal();
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});

  useEffect(() => {
    const handleDrop = () => {
      console.log("drop on window");
      setIsDragging(false);
    };
    const preventDefault = (e: globalThis.DragEvent) => e.preventDefault();
    if (typeof window !== "undefined") {
      window.addEventListener("drop", handleDrop);
      window.addEventListener("dragover", preventDefault);
    }
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.addEventListener("dragover", preventDefault);
    };
  }, [setIsDragging]);

  const itemDropOnModule = useItemDropOnModule({
    setIsDragging,
  });

  const itemDropOnDay = useItemDropOnDay({
    setIsDragging,
    setModalText,
    setModalCallback,
    setIsLoading,
    modal,
  });

  return (
    <DraggingContext.Provider
      value={{
        itemDropOnDay,
        itemDropOnModule,
      }}
    >
      <LectureReplaceModal
        modal={modal}
        modalText={modalText}
        modalCallback={modalCallback}
        isLoading={isLoading}
      />
      {children}
    </DraggingContext.Provider>
  );
}
