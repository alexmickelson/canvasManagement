import { createTrpcContext } from "@/services/serverFunctions/context";
import { trpcAppRouter } from "@/services/serverFunctions/appRouter";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcAppRouter,
    createContext: createTrpcContext,
  });
};

export { handler as GET, handler as POST };
