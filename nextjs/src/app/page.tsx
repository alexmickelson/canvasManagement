import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CourseList from "./CourseList";
import { hydrateCourses } from "@/hooks/hookHydration";
import { getQueryClient } from "./providersQueryClientUtils";


export default async function Home() {
  const queryClient = getQueryClient();
  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="min-h-screen">
      <HydrationBoundary state={dehydratedState}>
        <CourseList />
      </HydrationBoundary>
    </main>
  );
}
