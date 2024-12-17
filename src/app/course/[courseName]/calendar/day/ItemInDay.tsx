import { IModuleItem } from "@/models/local/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import {
  useDraggingContext,
  DraggableItem,
} from "../../context/drag/draggingContext";
import { createPortal } from "react-dom";
import ClientOnly from "@/components/ClientOnly";
import { useDragStyleContext } from "../../context/drag/dragStyleContext";

export function ItemInDay({
  type,
  moduleName,
  status,
  item,
  message,
}: {
  type: "assignment" | "page" | "quiz";
  status: "localOnly" | "incomplete" | "published";
  moduleName: string;
  item: IModuleItem;
  message: ReactNode;
}) {
  const { courseName } = useCourseContext();
  const { setIsDragging } = useDragStyleContext();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <div className={" relative group "}>
      <Link
        href={getModuleItemUrl(courseName, moduleName, type, item.name)}
        shallow={true}
        className={
          " border rounded-sm sm:px-1 sm:mx-1 break-words mb-1 truncate sm:text-wrap text-nowrap " +
          " bg-slate-800 " +
          " block " +
          (status === "localOnly" && " text-slate-500 border-slate-600 ") +
          (status === "incomplete" && " border-rose-900 ") +
          (status === "published" && " border-green-800 ")
        }
        role="button"
        draggable="true"
        onDragStart={(e) => {
          const draggableItem: DraggableItem = {
            type,
            item,
            sourceModuleName: moduleName,
          };
          e.dataTransfer.setData(
            "draggableItem",
            JSON.stringify(draggableItem)
          );
          setIsDragging(true)
          
        }}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        ref={linkRef}
      >
        {item.name}
      </Link>
      <ClientOnly>
        <Tooltip
          message={message}
          targetRef={linkRef}
          visible={tooltipVisible && status === "incomplete"}
        />
      </ClientOnly>
    </div>
  );
}

const Tooltip: React.FC<{
  message: ReactNode;
  targetRef: React.RefObject<HTMLElement>;
  visible: boolean;
}> = ({ message, targetRef, visible }) => {
  const rect = targetRef.current?.getBoundingClientRect();

  return createPortal(
    <div
      style={{
        top: (rect?.bottom ?? 0) + window.scrollY + 10,
        left: (rect?.left ?? 0) + window.scrollX + (rect?.width ?? 0) / 2,
      }}
      className={
        " absolute -translate-x-1/2 " +
        " bg-gray-800 text-white text-sm " +
        " rounded py-1 px-2 " +
        " transition-all duration-400 " +
        " border border-slate-700 shadow-[0_0px_10px_0px] shadow-slate-500/50 " +
        (visible ? "  " : " hidden -z-50 ")
      }
      role="tooltip"
    >
      {message}
    </div>,
    document.body
  );
};
