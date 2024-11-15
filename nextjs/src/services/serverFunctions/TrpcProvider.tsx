"use client";
import { useState } from "react";
import superjson from "superjson";
import { httpBatchLink, httpLink } from "@trpc/client";
import { trpc } from "./trpcClient";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { isServer } from "@tanstack/react-query";

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = isServer ? "http://localhost:3000/api/trpc/" : "/api/trpc";

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
          transformer: superjson,
          maxURLLength: 10_000, // limit number of batched requests
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={getQueryClient()}>
      {children}
    </trpc.Provider>
  );
}
