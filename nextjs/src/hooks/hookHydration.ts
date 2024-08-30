import { QueryClient } from "@tanstack/react-query";
import { localCourseKeys } from "./localCourse/localCoursesHooks";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const hydrateCourses = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async () => await fileStorageService.getCourseNames(),
  });
};

export const hydrateCourse = async (
  queryClient: QueryClient,
  courseName: string
) => {
  const settings = await fileStorageService.getCourseSettings(courseName);
  const moduleNames = await fileStorageService.getModuleNames(courseName)
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.settings(courseName),
    queryFn: () => settings,
  });
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: () => moduleNames,
  });
};
