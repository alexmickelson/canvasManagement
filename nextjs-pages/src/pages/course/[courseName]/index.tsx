import CourseContextProvider from "@/components/contexts/CourseContextProvider";
import DraggingContextProvider from "@/components/contexts/DraggingContextProvider";
import CourseCalendar from "@/components/courses/calendar/CourseCalendar";
import CourseSettings from "@/components/courses/CourseSettings";
import ModuleList from "@/components/modules/ModuleList";
import { getQueryClient } from "@/components/providersQueryClientUtils";
import { undefinedWithNull } from "@/components/undefinedToNull";
import { hydrateCourse } from "@/hooks/hookHydration";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { Suspense } from "react";

export const getServerSideProps: GetServerSideProps<
  { dehydratedState: DehydratedState },
  {
    courseName: string;
  }
> = async ({ params }) => {
  const queryClient = getQueryClient();
  if (!params) {
    const dehydratedState = undefinedWithNull(dehydrate(queryClient));
    return { props: { dehydratedState } };
  }
  const courseName = params?.courseName;
  const decodedCourseName = decodeURIComponent(courseName);
  await hydrateCourse(queryClient, decodedCourseName);
  const dehydratedState = undefinedWithNull(dehydrate(queryClient));

  return { props: { dehydratedState } };
};

export default function CourseDetails({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  const router = useRouter();
  const decodedCourseName = decodeURIComponent(
    router.query?.courseName as string
  );
  if (decodedCourseName.includes(".js.map")) {
    console.log("cannot load course that is .js.map " + decodedCourseName);
    return <div></div>;
  }

  return (
    <Suspense>
      <CourseContextProvider localCourseName={decodedCourseName}>
        <HydrationBoundary state={dehydratedState}>
          <div className="h-full flex flex-col">
            <CourseSettings />
            <div className="flex flex-row min-h-0">
              <DraggingContextProvider>
                <div className="flex-1 min-h-0">
                  <CourseCalendar />
                </div>
                <div className="w-96 p-3">
                  <ModuleList />
                </div>
              </DraggingContextProvider>
            </div>
          </div>
        </HydrationBoundary>
      </CourseContextProvider>
    </Suspense>
  );
}
