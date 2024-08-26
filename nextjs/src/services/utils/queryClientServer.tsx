import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export function createQueryClientForServer() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        onError: (e) => console.log(e),
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (e) => console.log(e),
    }),
    mutationCache: new MutationCache({
      onError: (e) => console.log(e),
    }),
  });
}
