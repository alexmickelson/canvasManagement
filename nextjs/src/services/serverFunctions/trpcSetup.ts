import { initTRPC } from "@trpc/server";
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

export const router = t.router;
export const procedure = t.procedure;
