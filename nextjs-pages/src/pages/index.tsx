import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query";
import CourseList from "../components/courses/CourseList";
import { getQueryClient } from "../components/providersQueryClientUtils";
import { hydrateCourses } from "@/hooks/hookHydration";
import { undefinedWithNull } from "@/components/undefinedToNull";

export async function getServerSideProps() {
  const queryClient = getQueryClient();
  await hydrateCourses(queryClient);
  const dehydratedState = undefinedWithNull(dehydrate(queryClient));

  return { props: { dehydratedState } };
}

export default function Home({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  return (
    <main className="min-h-screen">
      <HydrationBoundary state={dehydratedState}>
        <CourseList />
      </HydrationBoundary>
    </main>
  );
}
