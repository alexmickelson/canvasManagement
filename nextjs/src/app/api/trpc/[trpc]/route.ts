import { createTrpcContext } from "@/services/serverFunctions/context";
import { trpcAppRouter } from "@/services/serverFunctions/router/app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (request: Request) => {

  await new Promise(r => setTimeout(r, 1000)); // delay for testing
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcAppRouter,
    createContext: createTrpcContext,
  });
};

export { handler as GET, handler as POST };
