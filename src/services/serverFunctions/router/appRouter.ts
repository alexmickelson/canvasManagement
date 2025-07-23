import { createTrpcContext } from "../context";
import { createCallerFactory, router } from "../trpcSetup";
import { assignmentRouter } from "../../../features/local/assignments/assignmentRouter";
import { canvasFileRouter } from "./canvasFileRouter";
import { directoriesRouter } from "../../../features/local/utils/directoriesRouter";
import { globalSettingsRouter } from "../../../features/local/globalSettings/globalSettingsRouter";
import { lectureRouter } from "../../../features/local/lectures/lectureRouter";
import { pageRouter } from "../../../features/local/pages/pageRouter";
import { quizRouter } from "../../../features/local/quizzes/quizRouter";
import { settingsRouter } from "../../../features/local/course/settingsRouter";
import { moduleRouter } from "@/features/local/modules/moduleRouter";

export const trpcAppRouter = router({
  assignment: assignmentRouter,
  lectures: lectureRouter,
  settings: settingsRouter,
  quiz: quizRouter,
  page: pageRouter,
  module: moduleRouter,
  directories: directoriesRouter,
  canvasFile: canvasFileRouter,
  globalSettings: globalSettingsRouter,
});

export const createCaller = createCallerFactory(trpcAppRouter);

export const createAsyncCaller = async () => {
  const context = await createTrpcContext();
  return createCaller(context);
};

export type AppRouter = typeof trpcAppRouter;
