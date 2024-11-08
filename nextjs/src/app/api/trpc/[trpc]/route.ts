import { createTrpcContext } from "@/services/trpc/context";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcAppRouter,
    createContext: createTrpcContext,
  });
};

export { handler as GET, handler as POST };
