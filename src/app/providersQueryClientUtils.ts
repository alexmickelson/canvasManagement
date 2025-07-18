import { getAxiosErrorMessage } from "@/services/axiosUtils";
import { isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // staleTime: 60_000,
        staleTime: 1000 * 60 * 60, // 1 hour
        // refetchInterval: 7000, // debug only
        refetchOnWindowFocus: false,
        retry: 0,
        // refetchOnMount: false,
      },
      mutations: {
        onError: (error) => {
          const message = getAxiosErrorMessage(error as AxiosError);
          console.error("Mutation error:", message);
          if (!isServer) {
            toast.error(message);
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (e) => console.log("error in query client", e),
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
