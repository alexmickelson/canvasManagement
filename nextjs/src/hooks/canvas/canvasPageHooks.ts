import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { canvasPageService } from "@/services/canvas/canvasPageService";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";

export const canvasPageKeys = {
  pagesInCourse: (canvasCourseId: number) => [
    "canvas",
    canvasCourseId,
    "pages",
  ],
};

export const useCanvasPagesQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  return useSuspenseQuery({
    queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
    queryFn: async () => await canvasPageService.getAll(settings.canvasId),
  });
};

export const useCreateCanvasPageMutation = (canvasCourseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (page: LocalCoursePage) =>
      canvasPageService.create(canvasCourseId, page),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(canvasCourseId),
      });
    },
  });
};

export const useUpdateCanvasPageMutation = (canvasCourseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      page,
      canvasPageId,
    }: {
      page: LocalCoursePage;
      canvasPageId: number;
    }) => canvasPageService.update(canvasCourseId, canvasPageId, page),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(canvasCourseId),
      });
    },
  });
};

export const useDeleteCanvasPageMutation = (canvasCourseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canvasPageId: number) =>
      canvasPageService.delete(canvasCourseId, canvasPageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(canvasCourseId),
      });
    },
  });
};
