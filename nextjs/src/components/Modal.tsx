"use client";
import React, { ReactNode, useState } from "react";

export default function Modal({
  children,
  buttonText,
  buttonClass = "",
}: {
  children: (props: { closeModal: () => void }) => ReactNode;
  buttonText: string;
  buttonClass?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal} className={buttonClass}>
        {buttonText}
      </button>

      <div
        className={
          "fixed inset-0 flex items-center justify-center transition-all duration-400 " +
          " bg-black" +
          (isOpen ? " bg-opacity-50  z-50  " : " bg-opacity-0  -z-50  ")
        }
        onClick={closeModal}
      >
        <div
          onClick={(e) => {
            // e.preventDefault();
            e.stopPropagation();
          }}
          className={
            ` bg-slate-800 p-6 rounded-lg shadow-lg w-1/3  ` +
            ` transition-all duration-400 ` +
            ` ${isOpen ? "opacity-100" : "opacity-0"}`
          }
        >
          {isOpen && children({ closeModal })}
        </div>
      </div>
    </>
  );
}
