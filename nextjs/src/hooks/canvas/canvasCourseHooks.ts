import { canvasService } from "@/services/canvas/canvasService";
import { useSuspenseQuery } from "@tanstack/react-query";

export const canvasCourseKeys = {
  courseDetails: (canavasId: number) =>
    ["canvas", canavasId, "course details"] as const,
};

export const useCanvasCourseQuery = (canvasId: number) =>
  useSuspenseQuery({
    queryKey: canvasCourseKeys.courseDetails(canvasId),
    queryFn: async () => await canvasService.getCourse(canvasId),
  });
