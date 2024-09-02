import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { hydrateCourse } from "@/hooks/hookHydration";
import { getQueryClient } from "@/app/providersQueryClientUtils";

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
