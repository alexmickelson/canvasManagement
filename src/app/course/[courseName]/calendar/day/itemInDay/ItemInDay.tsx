"use client";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { FC, ReactNode, useCallback, useState } from "react";
import { useCourseContext } from "../../../context/courseContext";
import { useTooltip } from "@/components/useTooltip";
import { DraggableItem } from "../../../context/drag/draggingContext";
import ClientOnly from "@/components/ClientOnly";
import { useDragStyleContext } from "../../../context/drag/dragStyleContext";
import { Tooltip } from "../../../../../../components/Tooltip";
import { DayItemContextMenu } from "./DayItemContextMenu";
import { GetPreviewContent } from "./GetPreviewContent";

export const ItemInDay: FC<{
  type: "assignment" | "page" | "quiz";
  status: "localOnly" | "incomplete" | "published";
  moduleName: string;
  item: IModuleItem;
  message: ReactNode;
}> = ({ type, moduleName, status, item, message }) => {
  const { courseName } = useCourseContext();
  const { setIsDragging } = useDragStyleContext();
  const { visible, targetRef, showTooltip, hideTooltip } = useTooltip(500);

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (type !== "assignment") return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = useCallback(() => {
    setContextMenuPos(null);
  }, []);

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
            JSON.stringify(draggableItem),
          );
          setIsDragging(true);
        }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onContextMenu={handleContextMenu}
        ref={targetRef}
      >
        {item.name}
      </Link>
      <ClientOnly>
        {status === "published" ? (
          <Tooltip
            message={
              <div className="max-w-md">
                <GetPreviewContent type={type} item={item} />
              </div>
            }
            targetRef={targetRef}
            visible={visible}
          />
        ) : (
          <Tooltip message={message} targetRef={targetRef} visible={visible} />
        )}
        {contextMenuPos && type === "assignment" && (
          <DayItemContextMenu
            x={contextMenuPos.x}
            y={contextMenuPos.y}
            onClose={closeContextMenu}
            item={item}
            moduleName={moduleName}
          />
        )}
      </ClientOnly>
    </div>
  );
};
