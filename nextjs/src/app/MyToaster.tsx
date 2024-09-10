"use client";
import React from "react";
import { Toaster, ToastBar, useToaster } from "react-hot-toast";

export const MyToaster = () => {
  const { toasts, handlers } = useToaster({ duration: Infinity });
  const { startPause, endPause } = handlers;

  return (
    // <Toaster />
    <Toaster
      position="top-center"
      reverseOrder={false}
      // gutter={8}
      containerClassName=" flex flex-row w-full "
      containerStyle={{}}
      toastOptions={{
        className: "border-4 border-rose-900 drop-shadow-2xl grow",
        duration: 5_000,
        style: {
          background: "#030712",
          color: "#e5e7eb",
          paddingLeft: "2em",
          paddingRight: "2em",
          width: "100%"
        },

        success: {
          duration: 3000,
        },
      }}
    />
  );
};
