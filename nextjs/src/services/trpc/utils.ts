import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "./router/app";

export const trpc = createTRPCReact<AppRouter>();
