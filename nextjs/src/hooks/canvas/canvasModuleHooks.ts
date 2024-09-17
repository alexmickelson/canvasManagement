import { canvasModuleService } from "@/services/canvas/canvasModuleService";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";

export const canvasCourseModuleKeys = {
  modules: (canvasId: number) => ["canvas", canvasId, "module list"] as const,
};

export const useCanvasModulesQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  return useSuspenseQuery({
    queryKey: canvasCourseModuleKeys.modules(settings.canvasId),
    queryFn: async () =>
      await canvasModuleService.getCourseModules(settings.canvasId),
  });
};

export const useAddCanvasModuleMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) =>
      await canvasModuleService.createModule(settings.canvasId, moduleName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasCourseModuleKeys.modules(settings.canvasId),
      });
    },
  });
};
