"use client"
import {
  DehydratedState,
  hydrate,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ReactNode, useState } from "react";
import { createQueryClient } from "./queryClient";

export default function MyQueryClientProvider({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState: DehydratedState;
}) {
  const [queryClient] = useState(createQueryClient());

  hydrate(queryClient, dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
