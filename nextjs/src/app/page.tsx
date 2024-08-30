import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CourseList from "./CourseList";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";
import { hydrateCourses } from "@/hooks/hookHydration";

async function getDehydratedClient() {
  const queryClient = createQueryClientForServer();

  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
}

export default async function Home() {
  const dehydratedState = await getDehydratedClient();
  return (
    <main className="min-h-screen">
      <HydrationBoundary state={dehydratedState}>
        <CourseList />
      </HydrationBoundary>
    </main>
  );
}
