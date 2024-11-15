import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "./router/app";

export const trpc = createTRPCReact<AppRouter>();
