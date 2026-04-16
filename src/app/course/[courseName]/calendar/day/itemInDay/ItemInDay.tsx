"use client";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { useCourseContext } from "../../../context/courseContext";
import { useTooltip } from "@/components/useTooltip";
import { DraggableItem } from "../../../context/drag/draggingContext";
import ClientOnly from "@/components/ClientOnly";
import { useDragStyleContext } from "../../../context/drag/dragStyleContext";
import { Tooltip } from "../../../../../../components/Tooltip";
import { AssignmentDayItemContextMenu } from "./DayItemContextMenu";
import { GetPreviewContent } from "./GetPreviewContent";
import { useModal } from "@/components/Modal";

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
  const modalControl = useModal();

  const handleContextMenu = (e: React.MouseEvent) => {
    if (type !== "assignment") return;
    e.preventDefault();
    e.stopPropagation();
    modalControl.openModal({ x: e.clientX, y: e.clientY });
  };

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
        <div className="flex justify-between">
          <div className="flex-1">{item.name}</div>
          <div className="w-7 p-1">
            <ItemIcon type={type} />
          </div>
        </div>
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
        {type === "assignment" && (
          <AssignmentDayItemContextMenu
            modalControl={modalControl}
            item={item}
            moduleName={moduleName}
          />
        )}
      </ClientOnly>
    </div>
  );
};

const ItemIcon: FC<{ type: string }> = ({ type }) => {
  if (type === "assignment") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-sky-400/30"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M21 5.4A2.4 2.4 0 0 0 18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v15.2A2.4 2.4 0 0 0 5.4 23h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4Z"
            fill="currentColor"
            fillOpacity=".16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          ></path>
          <path
            d="M15.2 1H8.8a.8.8 0 0 0-.8.8v2.4a.8.8 0 0 0 .8.8h6.4a.8.8 0 0 0 .8-.8V1.8a.8.8 0 0 0-.8-.8Z"
            className="fill-sky-950"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M7 13h10M7 10h10M7 16h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          ></path>
        </g>
      </svg>
    );
  }
  if (type === "quiz") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-orange-400/30"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7"
            fill="currentColor"
            fillOpacity=".16"
          ></path>
          <path
            d="M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          ></path>
          <path
            d="M21.4 3H2.6A1.6 1.6 0 0 0 1 4.6v.8A1.6 1.6 0 0 0 2.6 7h18.8A1.6 1.6 0 0 0 23 5.4v-.8A1.6 1.6 0 0 0 21.4 3Z"
            className="fill-orange-950/20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M8 11h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          ></path>
        </g>
      </svg>
    );
  }
  if (type === "page") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-indigo-300/50"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z"
            fill="currentColor"
            fillOpacity=".16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M12 12V6M7 14V6M17 16V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          ></path>
        </g>
      </svg>
    );
  }
  return <></>;
};
