import { hydrateCourses } from "@/hooks/hookHydration";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";
import { dehydrate } from "@tanstack/react-query";

export async function getDehydratedState() {
  const queryClient = createQueryClientForServer();

  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
}
