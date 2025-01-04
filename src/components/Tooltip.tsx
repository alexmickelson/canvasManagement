import { ReactNode } from "react";
import { createPortal } from "react-dom";

export const Tooltip: React.FC<{
  message: ReactNode;
  targetRef: React.RefObject<HTMLAnchorElement | null>;
  visible: boolean;
}> = ({ message, targetRef, visible }) => {
  const rect = targetRef.current?.getBoundingClientRect();

  return createPortal(
    <div
      style={{
        top: (rect?.bottom ?? 0) + window.scrollY + 10,
        left: (rect?.left ?? 0) + window.scrollX + (rect?.width ?? 0) / 2,
      }}
      className={
        " absolute -translate-x-1/2 " +
        " bg-gray-900 text-slate-200 text-sm " +
        " rounded-md py-1 px-2 " +
        " transition-all duration-400 " +
        " border border-slate-700 shadow-[0px_0px_10px_5px] shadow-slate-500/20 " +
        (visible ? "  " : " hidden -z-50 ")
      }
      role="tooltip"
    >
      {message}
    </div>,
    document.body
  );
};
