import { canvasService } from "@/services/canvas/canvasService";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { canvasCourseModuleKeys } from "./canvasModuleHooks";

export const canvasKeys = {
  allTerms: ["all canvas terms"] as const,
  allAroundDate: (date: Date) => ["all canvas terms", date] as const,
};

export const useAllCanvasTermsQuery = () =>
  useSuspenseQuery({
    queryKey: canvasKeys.allTerms,
    queryFn: canvasService.getAllTerms,
  });
export const useCanvasTermsQuery = (queryDate: Date) => {
  const { data: terms } = useAllCanvasTermsQuery();

  return useSuspenseQuery({
    queryKey: canvasKeys.allAroundDate(queryDate),
    queryFn: () => {
      const currentTerms = terms
        .filter((t) => {
          if (!t.end_at) return false;

          const endDate = new Date(t.end_at);
          return endDate > queryDate;
        })
        .sort(
          (a, b) =>
            new Date(a.start_at ?? "").getTime() -
            new Date(b.start_at ?? "").getTime()
        )
        .slice(0, 3);

      return currentTerms;
    },
  });
};