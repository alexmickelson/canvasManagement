import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import { hydrateCourse } from "@/hooks/hookHydration";

export default async function CourseLayout({
  children,
  params: { courseName },
}: {
  children: React.ReactNode;
  params: { courseName: string };
}) {
  if (courseName.includes(".js.map")) {
    console.log("cannot load course that is .js.map " + courseName);
    return <div></div>;
  }
  const queryClient = getQueryClient();

  await hydrateCourse(queryClient, courseName);
  const dehydratedState = dehydrate(queryClient);

  // console.log("hydrated course state", courseName, dehydratedState);
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
