import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { canvasPageService } from "@/services/canvas/canvasPageService";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";

export const canvasPageKeys = {
  pagesInCourse: (courseCanvasId: number) => [
    "canvas",
    courseCanvasId,
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

export const useCreateCanvasPageMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (page: LocalCoursePage) =>
      canvasPageService.create(settings.canvasId, page),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
      });
    },
  });
};

export const useUpdateCanvasPageMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      page,
      canvasPageId,
    }: {
      page: LocalCoursePage;
      canvasPageId: number;
    }) => canvasPageService.update(settings.canvasId, canvasPageId, page),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
      });
    },
  });
};

export const useDeleteCanvasPageMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canvasPageId: number) =>
      canvasPageService.delete(settings.canvasId, canvasPageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
      });
    },
  });
};
