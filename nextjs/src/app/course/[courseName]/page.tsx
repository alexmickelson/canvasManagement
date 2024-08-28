import { getDehydratedClient } from "@/app/layout";
import CourseContextProvider from "./context/CourseContextProvider";
import CourseCalendar from "./calendar/CourseCalendar";
import { HydrationBoundary } from "@tanstack/react-query";
import CourseSettings from "./CourseSettings";
import ModuleList from "./modules/ModuleList";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const dehydratedState = await getDehydratedClient();
  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseContextProvider localCourseName={courseName}>
        <div className="h-full flex flex-col">
          <CourseSettings />
          <div className="flex flex-row min-h-0">
            <div className="flex-1 min-h-0">
              <CourseCalendar />
            </div>
            <div className="m-5">
              <ModuleList />
            </div>
          </div>
        </div>
      </CourseContextProvider>
    </HydrationBoundary>
  );
}
