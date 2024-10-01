import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { getAllAssignmentsQueryConfig } from "./assignmentHooks";
import { getAllQuizzesQueryConfig } from "./quizHooks";
import { getAllItemsQueryConfig } from "./courseItemHooks";

export const useModuleNamesQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules`;
      const response = await axiosClient.get(url);
      return response.data;
    },
  });
};

export const useCreateModuleMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) => {
      const url = `/api/courses/${courseName}/modules`;
      const response = await axiosClient.post(url, { moduleName });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.moduleNames(courseName),
      });
    },
  });
};

// // dangerous? really slowed down page...
// // maybe it only slowed down with react query devtools...
// export const useModuleDataQuery = (moduleName: string) => {
//   console.log("running");
//   const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
//   const { data: quizNames } = useQuizNamesQuery(moduleName);
//   const { data: pageNames } = usePageNamesQuery(moduleName);

//   const { data: assignments } = useAssignmentsQueries(
//     moduleName,
//     assignmentNames
//   );
//   const { data: quizzes } = useQuizzesQueries(moduleName, quizNames);
//   const { data: pages } = usePagesQueries(moduleName, pageNames);

//   return {
//     assignments,
//     quizzes,
//     pages,
//   };
//   // return useMemo(
//   //   () => ({
//   //     assignments,
//   //     quizzes,
//   //     pages,
//   //   }),
//   //   [assignments, pages, quizzes]
//   // );
// };

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
      getAllQuizzesQueryConfig(courseName, moduleName)
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
