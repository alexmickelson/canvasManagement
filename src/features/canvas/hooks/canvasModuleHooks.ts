import { CanvasModuleItem } from "@/features/canvas/models/modules/canvasModuleItems";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { canvasModuleService } from "../services/canvasModuleService";
import { IModuleItem } from "@/features/local/modules/IModuleItem";

export const canvasCourseModuleKeys = {
  modules: (canvasId: number) => ["canvas", canvasId, "module list"] as const,
};

export const useCanvasModulesQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  return useQuery({
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

export const useReorderCanvasModuleItemsMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleId,
      items,
    }: {
      moduleId: number;
      items: IModuleItem[];
    }) => {
      if (!settings?.canvasId) throw new Error("No canvasId in settings");

      const canvasModule = await canvasModuleService.getModuleWithItems(
        settings.canvasId,
        moduleId
      );
      if (!canvasModule.items) {
        throw new Error(
          "cannot sort canvas module items, no items found in module"
        );
      }
      const canvasItems = canvasModule.items;

      // Sort IModuleItems by dueAt
      const sorted = [...items].sort((a, b) => {
        const aDate = a.dueAt ? new Date(a.dueAt).getTime() : 0;
        const bDate = b.dueAt ? new Date(b.dueAt).getTime() : 0;
        return aDate - bDate;
      });

      // Map sorted IModuleItems to CanvasModuleItem ids by matching name/title
      const orderedIds = sorted
        .map((localItem) => canvasItems.find((canvasItem) => canvasItem.title === localItem.name)?.id)
        .filter((id): id is number => typeof id === "number");

      return await canvasModuleService.reorderModuleItems(
        settings.canvasId,
        moduleId,
        orderedIds
      );
    },
    onSuccess: (_data) => {
      if (!settings?.canvasId) return;
      queryClient.invalidateQueries({
        queryKey: canvasCourseModuleKeys.modules(settings.canvasId),
      });
    },
  });
};
