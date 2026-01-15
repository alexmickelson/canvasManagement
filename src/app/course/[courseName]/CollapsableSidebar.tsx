"use client";

import { useState, useEffect } from "react";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import LeftChevron from "@/components/icons/LeftChevron";
import RightChevron from "@/components/icons/RightChevron";

const collapseThreshold = 1400;

export default function CollapsableSidebar() {
  const [windowCollapseRecommended, setWindowCollapseRecommended] =
    useState(false);
  const [userCollapsed, setUserCollapsed] = useState<
    "unset" | "collapsed" | "uncollapsed"
  >("unset");

  useEffect(() => {
    // Initialize on mount
    setWindowCollapseRecommended(window.innerWidth <= collapseThreshold);

    function handleResize() {
      if (window.innerWidth <= collapseThreshold) {
        setWindowCollapseRecommended(true);
      } else {
        setWindowCollapseRecommended(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let collapsed;
  if (userCollapsed === "unset") {
    collapsed = windowCollapseRecommended;
  } else {
    collapsed = userCollapsed === "collapsed";
  }

  const widthClass = collapsed ? "w-0" : "w-96";
  const visibilityClass = collapsed ? "invisible " : "visible";

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between mb-2">
        <div className="visible mx-3 mt-2">
          <button
            onClick={() => {
              setUserCollapsed((prev) => {
                if (prev === "unset") {
                  return collapsed ? "uncollapsed" : "collapsed";
                }
                return prev === "collapsed" ? "uncollapsed" : "collapsed";
              });
            }}
          >
            {collapsed ? <LeftChevron /> : <RightChevron />}
          </button>
        </div>
        <div className={" " + (collapsed ? "w-0 invisible hidden" : "")}>
          <CourseSettingsLink />
        </div>
      </div>
      <div
        className={`${widthClass} flex-1 sm:p-3 overflow-y-auto transition-all ${visibilityClass}`}
      >
        <ModuleList />
      </div>
    </div>
  );
}
