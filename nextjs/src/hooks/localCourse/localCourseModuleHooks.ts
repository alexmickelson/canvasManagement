import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { getAllAssignmentsQueryConfig } from "./assignmentHooks";
import { getAllItemsQueryConfig } from "./courseItemHooks";
import {
  createModuleOnServer,
  getModuleNamesFromServer,
} from "./localCourseModuleServerActions";

export const useModuleNamesQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: async (): Promise<string[]> => {
      return await getModuleNamesFromServer({ courseName });
    },
  });
};

export const useCreateModuleMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) => {
      await createModuleOnServer({ courseName, moduleName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.moduleNames(courseName),
      });
    },
  });
};

export const useAllCourseDataQuery = () => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();

  const { data: assignmentsAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getAllAssignmentsQueryConfig(courseName, moduleName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((assignment) => ({
          moduleName: moduleNames[i],
          assignment,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  const { data: quizzesAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getAllItemsQueryConfig(courseName, moduleName, "Quiz")
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((quiz) => ({
          moduleName: moduleNames[i],
          quiz,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  const { data: pagesAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getAllItemsQueryConfig(courseName, moduleName, "Page")
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((page) => ({
          moduleName: moduleNames[i],
          page,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  return { assignmentsAndModules, quizzesAndModules, pagesAndModules };
};
