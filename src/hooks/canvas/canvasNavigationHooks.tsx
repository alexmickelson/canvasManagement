import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";
import { canvasNavigationService } from "@/services/canvas/canvasNavigationService";

export const canvasCourseTabKeys = {
  tabs: (canvasId: number) => ["canvas", canvasId, "tabs list"] as const,
};

export const useCanvasTabsQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  return useQuery({
    queryKey: canvasCourseTabKeys.tabs(settings.canvasId),
    queryFn: async () =>
      await canvasNavigationService.getCourseTabs(settings.canvasId),
  });
};

export const useUpdateCanvasTabMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tabId,
      hidden,
      position,
    }: {
      tabId: string;
      hidden?: boolean;
      position?: number;
    }) =>
      await canvasNavigationService.updateCourseTab(settings.canvasId, tabId, {
        hidden,
        position,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasCourseTabKeys.tabs(settings.canvasId),
        refetchType: "all",
      });
    },
  });
};
