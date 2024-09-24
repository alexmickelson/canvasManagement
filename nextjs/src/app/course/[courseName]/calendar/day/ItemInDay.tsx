import { IModuleItem } from "@/models/local/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import {
  useDraggingContext,
  DraggableItem,
} from "../../context/draggingContext";
import { createPortal } from "react-dom";

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
  const { dragStart } = useDraggingContext();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <div className={" relative group "}>
      <Link
        href={getModuleItemUrl(courseName, moduleName, type, item.name)}
        shallow={true}
        className={
          " border rounded-sm px-1 mx-1 break-words mb-1 " +
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
          dragStart();
        }}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        ref={linkRef}
      >
        {item.name}
      </Link>
      <Tooltip
        message={message}
        targetRef={linkRef}
        visible={tooltipVisible && status === "incomplete"}
      />
    </div>
  );
}

const Tooltip: React.FC<{
  message: ReactNode;
  targetRef: React.RefObject<HTMLElement>;
  visible: boolean;
}> = ({ message, targetRef, visible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 10, 
        left: rect.left + window.scrollX + rect.width / 2, 
      });
    }
  }, [targetRef]);


  return createPortal(
    <div
      style={{
        top: position.top,
        left: position.left,
      }}
      className={
        " absolute -translate-x-1/2 " +
        " bg-gray-800 text-white text-sm " +
        " rounded py-1 px-2 " +
        " transition-all duration-400 " +
        " border border-slate-700 shadow-[0_0px_10px_0px] shadow-slate-500/50 " +
        (visible ? " opacity-100 " : " opacity-0 -z-50 ")
      }
      role="tooltip"
    >
      {message}
    </div>,
    document.body
  );
};
