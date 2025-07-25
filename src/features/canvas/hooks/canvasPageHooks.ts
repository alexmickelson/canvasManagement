import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCanvasModulesQuery,
  useAddCanvasModuleMutation,
} from "./canvasModuleHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { canvasModuleService } from "../services/canvasModuleService";
import { canvasPageService } from "../services/canvasPageService";

export const canvasPageKeys = {
  pagesInCourse: (courseCanvasId: number) => [
    "canvas",
    courseCanvasId,
    "pages",
  ],
};

export const useCanvasPagesQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  return useQuery({
    queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
    queryFn: async () => await canvasPageService.getAll(settings.canvasId),
  });
};

export const useCreateCanvasPageMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  const { data: canvasModules } = useCanvasModulesQuery();
  const addModule = useAddCanvasModuleMutation();

  return useMutation({
    mutationFn: async ({
      page,
      moduleName,
    }: {
      page: LocalCoursePage;
      moduleName: string;
    }) => {
      if (!canvasModules) {
        console.log("cannot add page until modules loaded");
        return;
      }
      const canvasPage = await canvasPageService.create(
        settings.canvasId,
        page,
        settings
      );

      const canvasModule = canvasModules.find((c) => c.name === moduleName);
      const moduleId = canvasModule
        ? canvasModule.id
        : await addModule.mutateAsync(moduleName);

      await canvasModuleService.createPageModuleItem(
        settings.canvasId,
        moduleId,
        page.name,
        canvasPage
      );
      return canvasPage;
    },
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
    }) =>
      canvasPageService.update(settings.canvasId, canvasPageId, page, settings),
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
