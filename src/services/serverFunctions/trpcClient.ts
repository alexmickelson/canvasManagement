import { createTRPCReact } from "@trpc/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "./appRouter";

export const trpc = createTRPCReact<AppRouter>();

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
