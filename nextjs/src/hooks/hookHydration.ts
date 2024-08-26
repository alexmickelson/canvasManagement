import { QueryClient } from "@tanstack/react-query";
import { localCourseKeys } from "./localCoursesHooks";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const hydrateCourses = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async () => await fileStorageService.loadSavedCourses(),
  });
};
