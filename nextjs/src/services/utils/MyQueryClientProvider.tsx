"use client";

import {
  DehydratedState,
  hydrate,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { FC, ReactNode, useState } from "react";
import { createQueryClient } from "./queryClient";

export const MyQueryClientProvider: FC<{
  children: ReactNode;
  dehydratedState: DehydratedState;
}> = ({ children, dehydratedState }) => {
  const [queryClient] = useState(createQueryClient());

  hydrate(queryClient, dehydratedState);
  
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
