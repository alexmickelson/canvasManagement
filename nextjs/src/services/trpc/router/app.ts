import { createContext } from "../context";
import publicProcedure from "../procedures/public";
import { createCallerFactory, mergeRouters, router } from "../trpc";
import { assignmentRouter } from "./assignmentRouter";

export const helloRouter = router({
  sayHello: publicProcedure.query(() => {
    // runs on the server I think
    console.log("hello world router on the server?");
    return { greeting: `Hello World!` };
  }),
});

export const appRouter = router({
  hello: helloRouter,
  assignment: assignmentRouter,
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
