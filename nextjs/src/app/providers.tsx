"use client";
import {  QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { getQueryClient } from "./providersQueryClientUtils";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import TrpcProvider from "@/services/trpc/TrpcProvider";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary

  const queryClient = getQueryClient();

  return (
    <SuspenseAndErrorHandling>
      <TrpcProvider>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          {children}
        </QueryClientProvider>
      </TrpcProvider>
    </SuspenseAndErrorHandling>
  );
}
