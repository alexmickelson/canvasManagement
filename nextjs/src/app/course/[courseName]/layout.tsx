import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import CourseContextProvider from "./context/CourseContextProvider";
import { Suspense } from "react";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { hydrateCanvasCourse } from "@/hooks/hookHydration";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { createTrpcContext } from "@/services/trpc/context";
import superjson from "superjson";

export default async function CourseLayout({
  children,
  params: { courseName },
}: {
  children: React.ReactNode;
  params: { courseName: string };
}) {
  const decodedCourseName = decodeURIComponent(courseName);
  if (courseName.includes(".js.map")) {
    console.log("cannot load course that is .js.map " + decodedCourseName);
    return <div></div>;
  }
  const settings = await fileStorageService.settings.getCourseSettings(
    decodedCourseName
  );
  const queryClient = getQueryClient();
  await hydrateCanvasCourse(settings.canvasId, queryClient);
  const dehydratedState = dehydrate(queryClient);
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
        moduleNames.map(async (moduleName) => {
          await trpcHelper.assignment.getAllAssignments.prefetch({
            courseName,
            moduleName,
          });

          // await Promise.all(
          //   assignments.map(
          //     async (a) =>
          //       await trpcHelper.assignment.getAssignment.fetch({
          //         courseName,
          //         moduleName,
          //         assignmentName: a.name,
          //       })
          //   )
          // );
        })
      );
    })
  );
  const dehydratedTrpc = trpcHelper.dehydrate();
  return (
    <Suspense>
      <HydrationBoundary state={dehydratedState}>
        <HydrationBoundary state={dehydratedTrpc}>
          <CourseContextProvider localCourseName={decodedCourseName}>
            {children}
          </CourseContextProvider>
        </HydrationBoundary>
      </HydrationBoundary>
    </Suspense>
  );
}
