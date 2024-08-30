import CourseContextProvider from "./context/CourseContextProvider";
import CourseCalendar from "./calendar/CourseCalendar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CourseSettings from "./CourseSettings";
import ModuleList from "./modules/ModuleList";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";
import { hydrateCourse } from "@/hooks/hookHydration";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const queryClient = createQueryClientForServer();

  await hydrateCourse(queryClient, courseName);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseContextProvider localCourseName={courseName}>
        <div className="h-full flex flex-col">
          <CourseSettings courseName={courseName} />
          <div className="flex flex-row min-h-0">
            <div className="flex-1 min-h-0">
              <CourseCalendar />
            </div>
            <div className="w-96 p-3">
              <ModuleList />
            </div>
          </div>
        </div>
      </CourseContextProvider>
    </HydrationBoundary>
  );
}
