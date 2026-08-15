"use client";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { MobileActionsMenu } from "./MobileActionsMenu";

const helpSplitStorageKey = "editorHelpSplit";

export const EditLayout: FC<{
  Header: ReactNode;
  HeaderActions?: ReactNode;
  Help?: ReactNode;
  onCloseHelp?: () => void;
  Editor: ReactNode;
  Preview: ReactNode;
  Footer: ReactNode;
}> = ({ Header, HeaderActions, Help, onCloseHelp, Editor, Preview, Footer }) => {
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  // mobile-only: height of the help pane, adjustable via the drag handle
  const [helpHeight, setHelpHeight] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = parseInt(localStorage.getItem(helpSplitStorageKey) ?? "");
    return Number.isNaN(stored) ? null : stored;
  });
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // applied imperatively: React adopts server-rendered attributes during
  // hydration, so a style prop set from localStorage-initialized state would
  // never reach the DOM
  useEffect(() => {
    if (bodyRef.current && helpHeight !== null) {
      bodyRef.current.style.setProperty("--help-h", `${helpHeight}px`);
    }
  }, [helpHeight]);

  const toggleButtonClass = (active: boolean) =>
    "unstyled btn-thin px-2 py-0.5 text-sm " +
    (active ? "bg-blue-900/80 text-blue-50" : "bg-transparent text-slate-400");

  return (
    <div className="h-full flex flex-col align-middle px-1 max-w-[2400px] mx-auto bg-gray-900 rounded">
      <div className="py-1 flex flex-row flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1">
        <div className="min-w-0 flex-auto">{Header}</div>
        <div className="flex-none ms-auto flex flex-row items-center gap-2">
          <div className="md:hidden flex-none flex flex-row rounded border border-blue-900 overflow-hidden">
            <button
              className={toggleButtonClass(mobileView === "edit")}
              onClick={() => setMobileView("edit")}
            >
              Edit
            </button>
            <button
              className={toggleButtonClass(mobileView === "preview")}
              onClick={() => setMobileView("preview")}
            >
              Preview
            </button>
          </div>
          {HeaderActions && (
            <div className="max-md:hidden flex-none px-1">{HeaderActions}</div>
          )}
          <MobileActionsMenu>
            {HeaderActions && <div>{HeaderActions}</div>}
            {Footer}
          </MobileActionsMenu>
        </div>
      </div>
      <div
        ref={bodyRef}
        className="min-h-0 flex flex-row max-md:flex-col w-full flex-grow"
      >
        {Help && (
          <div className="md:max-w-96 md:flex-1 max-md:flex-none max-md:h-[var(--help-h,50vh)] min-w-0 overflow-y-auto">
            {onCloseHelp && (
              <div className="md:hidden text-end sticky top-0 bg-gray-900">
                <button
                  className="unstyled text-slate-400 hover:text-slate-200"
                  onClick={onCloseHelp}
                >
                  ✕ close help
                </button>
              </div>
            )}
            {Help}
          </div>
        )}
        {Help && (
          <div
            className="md:hidden flex-none h-4 my-0.5 cursor-row-resize touch-none flex items-center justify-center"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const body = bodyRef.current;
              if (!body) return;
              const rect = body.getBoundingClientRect();
              const newHeight = e.clientY - rect.top;
              const clamped = Math.min(
                Math.max(newHeight, 80),
                rect.height - 80,
              );
              setHelpHeight(clamped);
              localStorage.setItem(helpSplitStorageKey, String(clamped));
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            aria-label="resize help"
            role="separator"
          >
            <div className="w-16 h-1.5 rounded bg-slate-600" />
          </div>
        )}
        <div
          className={
            "flex-1 h-full min-w-0 " +
            (mobileView === "edit" ? "" : "max-md:hidden")
          }
        >
          {Editor}
        </div>
        <div
          className={
            "flex-1 h-full min-w-0 max-md:overflow-y-auto " +
            (mobileView === "preview" ? "" : "max-md:hidden")
          }
        >
          {Preview}
        </div>
      </div>
      <div className="max-md:hidden">{Footer}</div>
    </div>
  );
};
