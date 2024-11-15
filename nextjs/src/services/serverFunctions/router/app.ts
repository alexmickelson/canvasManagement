import { createTrpcContext } from "../context";
import { createCallerFactory, router } from "../trpcSetup";
import { assignmentRouter } from "./assignmentRouter";
import { directoriesRouter } from "./directoriesRouter";
import { lectureRouter } from "./lectureRouter";
import { moduleRouter } from "./moduleRouter";
import { pageRouter } from "./pageRouter";
import { quizRouter } from "./quizRouter";
import { settingsRouter } from "./settingsRouter";

export const trpcAppRouter = router({
  assignment: assignmentRouter,
  lectures: lectureRouter,
  settings: settingsRouter,
  quiz: quizRouter,
  page: pageRouter,
  module: moduleRouter,
  directories: directoriesRouter,
});

export const createCaller = createCallerFactory(trpcAppRouter);

export const createAsyncCaller = async () => {
  const context = await createTrpcContext();
  return createCaller(context);
};

export type AppRouter = typeof trpcAppRouter;
