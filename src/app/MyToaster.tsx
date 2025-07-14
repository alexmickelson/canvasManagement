"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export const MyToaster = () => {

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
