import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { hydrateCourse } from "@/hooks/hookHydration";
import CourseContextProvider from "./context/CourseContextProvider";
import { Suspense } from "react";

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
  const queryClient = getQueryClient();

  await hydrateCourse(queryClient, decodedCourseName);
  const dehydratedState = dehydrate(queryClient);

  // console.log("hydrated course state", courseName, dehydratedState);
  return (
    <Suspense>
      <CourseContextProvider localCourseName={decodedCourseName}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </CourseContextProvider>
    </Suspense>
  );
}
