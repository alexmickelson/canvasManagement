import { getDehydratedClient } from "@/app/layout";
import CourseContextProvider from "./context/CourseContextProvider";
import CourseCalendar from "./calendar/CourseCalendar";
import { HydrationBoundary } from "@tanstack/react-query";
import CourseSettings from "./CourseSettings";
import ModuleList from "./ModuleList";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const dehydratedState = await getDehydratedClient();
  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseContextProvider localCourseName={courseName}>
        <div>
          <CourseSettings />
          <div className="flex flex-row">
            <div className="grow">
              <CourseCalendar />
            </div>
            <div className="w-96">
              <ModuleList />
            </div>
          </div>
        </div>
      </CourseContextProvider>
    </HydrationBoundary>
  );
}
