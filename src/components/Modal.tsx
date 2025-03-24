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
  buttonText,
  buttonClass = "",
  modalWidth = "w-1/3",
  modalControl,
}: {
  children: (props: { closeModal: () => void }) => ReactNode;
  buttonText: string;
  buttonClass?: string;
  modalWidth?: string;
  modalControl: ModalControl;
}) {
  return (
    <>
      <button onClick={modalControl.openModal} className={buttonClass}>
        {buttonText}
      </button>

      <div
        className={
          " fixed inset-0 flex items-center justify-center transition-all duration-400 h-screen w-screen " +
          " bg-black" +
          (modalControl.isOpen
            ? " bg-opacity-50  z-50  "
            : " bg-opacity-0  -z-50  ")
        }
        onClick={modalControl.closeModal}
        // if mouse up here, do not, if mouse down then still do
      >
        <div
          onClick={(e) => {
            // e.preventDefault();
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
