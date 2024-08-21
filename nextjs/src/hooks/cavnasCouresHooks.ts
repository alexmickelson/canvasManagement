import { useSuspenseQuery } from "@tanstack/react-query";

export const canvasCourseKeys = {
  courseDetails: (canavasId: number) => ["canvas course", canavasId] as const,
};


export const useCanvasCourseQuery =(canvasId: number) => useSuspenseQuery({
  queryKey: canvasCourseKeys.courseDetails(canvasId),
  queryFn: async () => canvasserv
})
