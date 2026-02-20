"use client";
import React, { ReactNode, useCallback, useMemo, useState } from "react";

export interface ModalControl {
  isOpen: boolean;
  openModal: (position?: { x: number; y: number }) => void;
  closeModal: () => void;
  position?: { x: number; y: number };
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const openModal = useCallback((pos?: { x: number; y: number }) => {
    setPosition(pos);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setPosition(undefined);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
      position,
    }),
    [closeModal, isOpen, openModal, position],
  );
}

export default function Modal({
  children,
  buttonText = "",
  buttonClass = "",
  modalWidth = "w-1/3",
  modalControl,
  buttonComponent,
}: {
  children: (props: { closeModal: () => void }) => ReactNode;
  buttonText?: string;
  buttonClass?: string;
  modalWidth?: string;
  modalControl: ModalControl;
  buttonComponent?: (props: { openModal: () => void }) => ReactNode;
}) {
  return (
    <>
      {buttonComponent
        ? buttonComponent({ openModal: () => modalControl.openModal() })
        : buttonText && (
            <button
              onClick={() => modalControl.openModal()}
              className={buttonClass}
            >
              {buttonText}
            </button>
          )}

      <div
        className={
          modalControl.isOpen
            ? `transition-all duration-400 fixed inset-0 ${modalControl.position ? "" : "flex items-center justify-center"} h-screen bg-black/80 z-50 w-screen`
            : "hidden h-0 w-0 p-1 -z-50"
        }
        onClick={modalControl.closeModal}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`bg-slate-800 ${modalControl.position ? "" : "p-6"} rounded-lg shadow-lg ${modalControl.position ? "" : modalWidth} transition-all duration-400 ${modalControl.isOpen ? "opacity-100" : "opacity-0"}`}
          style={
            modalControl.position
              ? {
                  position: "fixed",
                  left: modalControl.position.x,
                  top: modalControl.position.y,
                }
              : undefined
          }
        >
          {modalControl.isOpen &&
            children({ closeModal: modalControl.closeModal })}
        </div>
      </div>
    </>
  );
}
