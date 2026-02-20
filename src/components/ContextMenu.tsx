"use client";
import { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded shadow-xl overflow-hidden min-w-44"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) =>
        item.href ? (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer whitespace-nowrap"
            onClick={onClose}
          >
            {item.label}
          </a>
        ) : (
          <button
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            className={
              "w-full text-left px-4 py-2 text-sm hover:bg-slate-700 disabled:opacity-50 whitespace-nowrap " +
              (item.variant === "danger"
                ? "text-red-400 hover:text-red-300"
                : "")
            }
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
