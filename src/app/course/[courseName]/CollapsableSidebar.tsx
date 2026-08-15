"use client";

import { useState, useEffect } from "react";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import LeftChevron from "@/components/icons/LeftChevron";
import RightChevron from "@/components/icons/RightChevron";

const collapseThreshold = 1400;
const mobileThreshold = 640;

export default function CollapsableSidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const [windowCollapseRecommended, setWindowCollapseRecommended] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState<
    "unset" | "collapsed" | "uncollapsed"
  >("unset");

  useEffect(() => {
    // Initialize on mount
    setWindowCollapseRecommended(window.innerWidth <= collapseThreshold);
    setIsMobile(window.innerWidth < mobileThreshold);

    function handleResize() {
      if (window.innerWidth <= collapseThreshold) {
        setWindowCollapseRecommended(true);
      } else {
        setWindowCollapseRecommended(false);
      }
      setIsMobile(window.innerWidth < mobileThreshold);
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

  const toggleCollapsed = () => {
    setUserCollapsed((prev) => {
      if (prev === "unset") {
        return collapsed ? "uncollapsed" : "collapsed";
      }
      return prev === "collapsed" ? "uncollapsed" : "collapsed";
    });
  };

  if (isMobile) {
    // opened from the "Modules" item in the course page's hamburger menu
    if (!mobileOpen) return null;
    return (
      <div className="fixed inset-0 z-40 bg-gray-950 flex flex-col">
        <div className="flex flex-row justify-between items-center p-2">
          <button onClick={onMobileClose}>Close</button>
          <CourseSettingsLink />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <ModuleList />
        </div>
      </div>
    );
  }

  const widthClass = collapsed ? "w-0" : "w-96";
  const visibilityClass = collapsed ? "invisible " : "visible";

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between mb-2">
        <div className="visible mx-3 mt-2">
          <button onClick={toggleCollapsed}>
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
