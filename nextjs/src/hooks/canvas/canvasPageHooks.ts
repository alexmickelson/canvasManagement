import { canvasPageService } from "@/services/canvas/canvasPageService";
import { useQuery } from "@tanstack/react-query";

export const canvasPageKeys = {
  pagesInCourse: (canvasCourseId: number) => [
    "canvas",
    canvasCourseId,
    "pages",
  ],
};

export const useCanvasPagesQuery = (canvasCourseId: number) =>
  useQuery({
    queryKey: canvasPageKeys.pagesInCourse(canvasCourseId),
    queryFn: async () => await canvasPageService.getAll(canvasCourseId),
  });
