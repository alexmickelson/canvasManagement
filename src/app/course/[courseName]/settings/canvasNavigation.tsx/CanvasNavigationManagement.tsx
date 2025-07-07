import React, { useState } from "react";
import { useCanvasTabsQuery } from "@/hooks/canvas/canvasNavigationHooks";
import { CanvasCourseTab } from "@/services/canvas/canvasNavigationService";
import { useUpdateCanvasTabMutation } from "@/hooks/canvas/canvasNavigationHooks";
import { Spinner } from "@/components/Spinner";
import { NavTabListItem } from "./NavTabListItem";

export const CanvasNavigationManagement = () => {
  const { data: tabs, isLoading, isError } = useCanvasTabsQuery();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const updateTab = useUpdateCanvasTabMutation();

  const handleHideAllExternal = async () => {
    if (!tabs) return;
    for (const tab of tabs.filter(
      (tab) => tab.type.toLowerCase() === "external" && !tab.hidden
    )) {
      await updateTab.mutateAsync({
        tabId: tab.id,
        hidden: true,
        position: tab.position,
      });
    }
  };

  if (isLoading) return <div>Loading tabs...</div>;
  if (isError || !tabs) return <div>Error loading tabs.</div>;

  const handleDragStart = (idx: number) => setDraggedIndex(idx);
  const handleDrop = async (dropIdx: number) => {
    if (draggedIndex === null || draggedIndex === dropIdx || !tabs) {
      setDraggedIndex(null);
      return;
    }
    const newTabs = [...tabs].sort((a, b) => a.position - b.position);
    const [removed] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(dropIdx, 0, removed);
    // Persist new order
    for (let i = 0; i < newTabs.length; i++) {
      const tab = newTabs[i];
      if (tab.position !== i + 1) {
        await updateTab.mutateAsync({
          tabId: tab.id,
          position: i + 1,
          hidden: tab.hidden,
        });
      }
    }
    setDraggedIndex(null);
  };

  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">
          Manage Course Navigation Tabs
        </h2>
        <div>
          {updateTab.isPending ? (
            <Spinner />
          ) : (
            <button
              className="mb-4 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white"
              onClick={handleHideAllExternal}
              disabled={updateTab.isPending}
            >
              Hide All External
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-center ">
        <ul className="w-md h-[800px] overflow-y-auto rounded bg-slate-950 p-4 border border-slate-700">
          {[...tabs]
            .sort((a, b) => a.position - b.position)
            .map((tab, idx) => (
              <NavTabListItem
                key={tab.id}
                tab={tab}
                idx={idx}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={() => handleDrop(idx)}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};
