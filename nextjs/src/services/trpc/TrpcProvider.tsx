"use client";
import { useState } from "react";
import superjson from "superjson";
import { httpBatchLink, httpLink } from "@trpc/client";
import { trpc } from "./utils";
import { getQueryClient } from "@/app/providersQueryClientUtils";

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Your production URL environment variable may be different
  const url = "http://localhost:3000/api/trpc/"
   //"/api/trpc";
    // process.env.NEXT_PUBLIC_APP_DOMAIN &&
    // !process.env.NEXT_PUBLIC_APP_DOMAIN.includes("localhost")
    //   ? `https://www.${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/trpc/`
    //   : "http://localhost:3000/api/trpc/";

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url,
          transformer: superjson,
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
