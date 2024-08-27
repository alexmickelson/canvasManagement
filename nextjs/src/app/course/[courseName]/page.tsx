import { getDehydratedClient } from "@/app/layout";
import { HydrationBoundary } from "@tanstack/react-query";
import CourseContextProvider from "./context/CourseContextProvider";
import CourseDetails from "./CourseDetails";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const dehydratedState = await getDehydratedClient();
  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseContextProvider localCourseName={courseName}>
        <CourseDetails />
      </CourseContextProvider>
    </HydrationBoundary>
  );
}
