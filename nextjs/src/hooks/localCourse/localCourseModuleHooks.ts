import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import {
  createModuleOnServer,
  getModuleNamesFromServer,
} from "./localCourseModuleServerActions";
import { trpc } from "@/services/trpc/utils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";

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

export const useAllCourseDataQuery = (): {
  assignmentsAndModules: {
    moduleName: string;
    assignment: LocalAssignment;
}[];
  quizzesAndModules: any[];
  pagesAndModules: any[];
} => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();

  const [assignments] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.assignment.getAllAssignments({ courseName, moduleName })
    )
  );

  const assignmentsAndModules = moduleNames.flatMap((moduleName, index) => {
    return assignments[index].map((assignment) => ({ moduleName, assignment }));
  });

  // const { data: assignmentsAndModules } = useSuspenseQueries({
  //   queries: moduleNames.map((moduleName) =>
  //     getAllAssignmentsQueryConfig(courseName, moduleName)
  //   ),
  //   combine: (results) => ({
  //     data: results.flatMap((r, i) =>
  //       r.data.map((assignment) => ({
  //         moduleName: moduleNames[i],
  //         assignment,
  //       }))
  //     ),
  //     pending: results.some((r) => r.isPending),
  //   }),
  // });

  // const { data: quizzesAndModules } = useSuspenseQueries({
  //   queries: moduleNames.map((moduleName) =>
  //     getAllItemsQueryConfig(courseName, moduleName, "Quiz")
  //   ),
  //   combine: (results) => ({
  //     data: results.flatMap((r, i) =>
  //       r.data.map((quiz) => ({
  //         moduleName: moduleNames[i],
  //         quiz,
  //       }))
  //     ),
  //     pending: results.some((r) => r.isPending),
  //   }),
  // });

  // const { data: pagesAndModules } = useSuspenseQueries({
  //   queries: moduleNames.map((moduleName) =>
  //     getAllItemsQueryConfig(courseName, moduleName, "Page")
  //   ),
  //   combine: (results) => ({
  //     data: results.flatMap((r, i) =>
  //       r.data.map((page) => ({
  //         moduleName: moduleNames[i],
  //         page,
  //       }))
  //     ),
  //     pending: results.some((r) => r.isPending),
  //   }),
  // });

  return { assignmentsAndModules, quizzesAndModules: [], pagesAndModules: [] };
};
