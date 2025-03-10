"use client";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/serverFunctions/trpcClient";

export const useLocalCoursesSettingsQuery = () =>
  trpc.settings.allCoursesSettings.useSuspenseQuery();

export const useLocalCourseSettingsQuery = () => {
  const { courseName } = useCourseContext();
  return trpc.settings.courseSettings.useSuspenseQuery({ courseName });
};

export const useCreateLocalCourseMutation = () => {
  const utils = trpc.useUtils();
  return trpc.settings.createCourse.useMutation({
    onSuccess: () => {
      utils.settings.allCoursesSettings.invalidate();
      utils.directories.getEmptyDirectories.invalidate();
    },
  });
};

export const useUpdateLocalCourseSettingsMutation = () => {
  const { courseName } = useCourseContext();
  const utils = trpc.useUtils();

  return trpc.settings.updateSettings.useMutation({
    onSuccess: () => {
      utils.settings.allCoursesSettings.invalidate();
      utils.settings.courseSettings.invalidate({ courseName });
    },
  });
};
