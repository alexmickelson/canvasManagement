import { hydrateCourses } from "@/hooks/hookHydration";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { createTrpcContext } from "@/services/trpc/context";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import CourseList from "./CourseList";
import AddNewCourse from "./newCourse/AddNewCourse";
import TodaysLectures from "./todaysLectures/TodaysLectures";
import superjson from "superjson";
import { trpc } from "@/services/trpc/utils";

export default async function Home() {
  const trpcHelper = createServerSideHelpers({
    router: trpcAppRouter,
    ctx: createTrpcContext(),
    transformer: superjson,
  });
  const allSettings = await fileStorageService.settings.getAllCoursesSettings();
  await Promise.all(
    allSettings.map(async (settings) => {
      const courseName = settings.name;
      const moduleNames = await fileStorageService.modules.getModuleNames(
        courseName
      );
      await Promise.all(
        moduleNames.map(
          async (moduleName) =>
            await trpcHelper.assignment.getAllAssignments.fetch({
              courseName,
              moduleName,
            })
        )
      );
    })
  );

  await Promise.all(
    allSettings.map(
      async (settings) =>
        await trpcHelper.lectures.getLectures.prefetch({ courseName: settings.name })
    )
  );

  await hydrateCourses(trpcHelper.queryClient);

  const dehydratedState = dehydrate(trpcHelper.queryClient);
  // console.log("dehydratedState", dehydratedState);
  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="h-full flex justify-center overflow-auto">
        <div className="xl:w-[900px] mx-auto">
          <br />
          <br />
          <br />
          <br />
          <div className=" flex justify-center">
            <CourseList />
          </div>
          <br />
          <br />
          <TodaysLectures />
          <br />
          <br />
          <AddNewCourse />
        </div>
      </main>
    </HydrationBoundary>
  );
}
