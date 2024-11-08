import { createTrpcContext } from "../context";
import publicProcedure from "../procedures/public";
import { createCallerFactory, router } from "../trpc";
import { assignmentRouter } from "./assignmentRouter";
import { lectureRouter } from "./lectureRouter";
import { settingsRouter } from "./settingsRouter";

export const helloRouter = router({
  sayHello: publicProcedure.query(() => {
    // runs on the server I think
    console.log("hello world router on the server?");
    return { greeting: `Hello World!` };
  }),
});

export const trpcAppRouter = router({
  hello: helloRouter,
  assignment: assignmentRouter,
  lectures: lectureRouter,
  settings: settingsRouter,
});

export const createCaller = createCallerFactory(trpcAppRouter);

export const createAsyncCaller = async () => {
  const context = await createTrpcContext();
  return createCaller(context);
};

export type AppRouter = typeof trpcAppRouter;
