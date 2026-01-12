"use client";
import React, { ReactNode, useCallback, useMemo, useState } from "react";

export interface ModalControl {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
    }),
    [closeModal, isOpen, openModal]
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
      {buttonComponent ? (
        buttonComponent({ openModal: modalControl.openModal })
      ) : (
        <button onClick={modalControl.openModal} className={buttonClass}>
          {buttonText}
        </button>
      )}

      <div
        className={
          modalControl.isOpen
            ? "transition-all duration-400 fixed inset-0 flex items-center justify-center h-screen bg-black/80 z-50 w-screen"
            : "hidden h-0 w-0 p-1 -z-50"
        }
        onClick={modalControl.closeModal}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={
            ` bg-slate-800 p-6 rounded-lg shadow-lg ` +
            modalWidth +
            ` transition-all duration-400 ` +
            ` ${modalControl.isOpen ? "opacity-100" : "opacity-0"}`
          }
        >
          {modalControl.isOpen &&
            children({ closeModal: modalControl.closeModal })}
        </div>
      </div>
    </>
  );
}
