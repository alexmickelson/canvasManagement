import CourseDetailsWrapper from "@/app/CourseDetailsWrapper";
import { getDehydratedClient } from "@/app/layout";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  const dehydratedState = await getDehydratedClient();
  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseDetailsWrapper courseName={courseName} />
    </HydrationBoundary>
  );
}
