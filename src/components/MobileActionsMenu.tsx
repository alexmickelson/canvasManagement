"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

// Lets buttons rendered inside the mobile actions menu close it after a tap
// (e.g. Toggle Help, whose effect would otherwise be hidden behind the menu).
// Outside the menu, closeMenu is a no-op.
const ActionsMenuContext = createContext<{ closeMenu: () => void }>({
  closeMenu: () => {},
});

export function useActionsMenu() {
  return useContext(ActionsMenuContext);
}

// Wraps a menu entry whose effect happens outside the menu (links, external
// tabs) so tapping it also dismisses the menu.
export function CloseMenuOnClick({ children }: { children: ReactNode }) {
  const { closeMenu } = useActionsMenu();
  return <div onClick={closeMenu}>{children}</div>;
}

// The mobile-only ☰ trigger plus its top-right dropdown. Children are shown
// as menu items (see the .actions-menu styles in globals.css). Hidden on md+.
export function MobileActionsMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuContext = useMemo(() => ({ closeMenu: () => setOpen(false) }), []);

  return (
    <>
      <button
        className="md:hidden unstyled flex-none px-2 text-slate-300 text-xl leading-none"
        onClick={() => setOpen(true)}
        aria-label="actions menu"
      >
        ☰
      </button>
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="actions-menu absolute top-11 right-1 w-64 max-w-[calc(100vw-0.5rem)] max-h-[80vh] overflow-y-auto bg-gray-900 border border-slate-700 rounded-xl shadow-lg shadow-black/50 p-2 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionsMenuContext.Provider value={menuContext}>
              {children}
            </ActionsMenuContext.Provider>
          </div>
        </div>
      )}
    </>
  );
}
