import { HydrationBoundary } from "@tanstack/react-query";
import CourseList from "./CourseList";
import { getDehydratedClient } from "./layout";

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
