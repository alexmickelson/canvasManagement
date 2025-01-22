"use client";

import { useState } from "react";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import LeftChevron from "@/components/icons/LeftChevron";
import RightChevron from "@/components/icons/RightChevron";

export default function CollapsableSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const widthClass = isCollapsed ? "w-0" : "w-96";
  const visibilityClass = isCollapsed ? "invisible" : "visible";
  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <div className="visible mx-3 mt-2">
          <button onClick={() => setIsCollapsed((i) => !i)}>
            {isCollapsed ? <LeftChevron /> : <RightChevron />}
          </button>
        </div>
        <div className={isCollapsed ? "w-0 invisible hidden" : ""}>
          <CourseSettingsLink />
        </div>
      </div>
      <div
        className={`${widthClass} sm:p-3 h-full overflow-y-auto transition-all ${visibilityClass}`}
      >
        <ModuleList />
      </div>
    </div>
  );
}
