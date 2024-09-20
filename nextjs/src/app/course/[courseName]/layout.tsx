import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import CourseContextProvider from "./context/CourseContextProvider";
import { Suspense } from "react";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { hydrateCanvasCourse } from "@/hooks/hookHydration";

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
  return (
    <Suspense>
      <HydrationBoundary state={dehydratedState}>
        <CourseContextProvider localCourseName={decodedCourseName}>
          {children}
        </CourseContextProvider>
      </HydrationBoundary>
    </Suspense>
  );
}
