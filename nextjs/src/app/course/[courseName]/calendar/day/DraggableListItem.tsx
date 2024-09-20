import { IModuleItem } from "@/models/local/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { ReactNode } from "react";
import { useCourseContext } from "../../context/courseContext";
import { useDraggingContext, DraggableItem } from "../../context/draggingContext";

export function DraggableListItem({
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
  return (
    <Link
      href={getModuleItemUrl(courseName, moduleName, type, item.name)}
      shallow={true}
      className={
        " relative group " +
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
        e.dataTransfer.setData("draggableItem", JSON.stringify(draggableItem));
        dragStart();
      }}
    >
      {item.name}
      {status === "incomplete" && (
        <div
          className={
            " absolute opacity-0 transition-all duration-700 " +
            " group-hover:block group-hover:opacity-100" +
            " bg-gray-800 text-white text-sm " +
            " rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2 " +
            " whitespace-no-wrap min-w-full max-w-96 "
          }
          role="tooltip"
        >
          {message}
        </div>
      )}
    </Link>
  );
}
