import { Spinner } from "@/components/Spinner";
import { useUpdateCanvasTabMutation } from "@/hooks/canvas/canvasNavigationHooks";
import { CanvasCourseTab } from "@/services/canvas/canvasNavigationService";
import React, { FC } from "react";

export const NavTabListItem: FC<{
  tab: CanvasCourseTab;
  idx: number;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
}> = ({ tab, idx, onDragStart, onDragOver, onDrop }) => {
  const updateTab = useUpdateCanvasTabMutation();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const handleToggleVisibility = () => {
    updateTab.mutate({
      tabId: tab.id,
      hidden: !tab.hidden,
      position: tab.position,
    });
  };
  return (
    <li
      key={tab.id}
      className={`flex items-center justify-between mb-2 p-1 px-4 rounded bg-slate-800 ${
        tab.hidden ? "opacity-50" : ""
      } ${isDragOver ? "border-t-4 border-blue-400" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop();
      }}
    >
      <span className="flex-1 cursor-move">{tab.label}</span>
      {updateTab.isPending && <Spinner />}
      <span className="text-xs text-slate-400 mr-2">{tab.type}</span>
      <button
        className={` py-1 rounded unstyled w-20 ${
          tab.hidden ? "bg-slate-600" : "bg-blue-900/50"
        }`}
        onClick={handleToggleVisibility}
        disabled={updateTab.isPending}
      >
        {tab.hidden ? "Show" : "Hide"}
      </button>
    </li>
  );
};
