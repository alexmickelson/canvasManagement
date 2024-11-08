import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { Suspense } from "react";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { hydrateCanvasCourse } from "@/hooks/hookHydration";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { createTrpcContext } from "@/services/trpc/context";
import superjson from "superjson";
import CourseContextProvider from "./context/CourseContextProvider";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseName: string }>;
}) {
  const { courseName } = await params;
  const decodedCourseName = decodeURIComponent(courseName);
  if (courseName.includes(".js.map")) {
    console.log("cannot load course that is .js.map " + decodedCourseName);
    return <div></div>;
  }
  // const settings = await fileStorageService.settings.getCourseSettings(
  //   decodedCourseName
  // );
  // const queryClient = getQueryClient();
  // await hydrateCanvasCourse(settings.canvasId, queryClient);
  // const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense>
      {/* <HydrationBoundary state={dehydratedState}> */}
      <CourseContextProvider localCourseName={decodedCourseName}>
        {children}
      </CourseContextProvider>
      {/* </HydrationBoundary> */}
    </Suspense>
  );
}
