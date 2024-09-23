import Modal from "@/components/Modal";
import React, { FC, useEffect, useRef } from "react";
import NewItemForm from "../../modules/NewItemForm";

export const DayContextMenu: FC<{
  coordinates?: { x: number; y: number };
  hideContextMenu: () => void;
  day: string;
}> = ({ coordinates, hideContextMenu, day }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // const handleContextMenu = (event: MouseEvent) => {
  //   event.preventDefault();
  //   setPosition({ x: event.pageX, y: event.pageY });
  //   setVisible(true);
  // };

  const handleClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      hideContextMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  
  return (
    <div
      className={
        "absolute z-10 border bg-slate-900 border-slate-300 rounded shadow-lg w-48 " +
        (!coordinates && "hidden")
      }
      style={{ top: coordinates?.y, left: coordinates?.x }}
      onMouseDown={(e) => {
        console.log(e.target);
        e.stopPropagation();
        hideContextMenu();
      }}
      ref={menuRef}
    >
      <Modal buttonText="Add Module Item">
        {({ closeModal }) => (
          <div>
            <NewItemForm
              creationDate={day}
              onCreate={() => {
                closeModal();
                hideContextMenu();
              }}
            />
            <br />
            <button
              onClick={() => {
                closeModal();
                hideContextMenu();
              }}
            >
              close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
