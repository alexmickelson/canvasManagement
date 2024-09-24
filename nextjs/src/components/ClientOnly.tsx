"use client";
import { isServer } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isServer]);

  if (!isClient) return <></>;
  return <>{children}</>;
}
