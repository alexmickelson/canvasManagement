import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/serverFunctions/trpcClient";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";

export const useModuleNamesQuery = () => {
  const { courseName } = useCourseContext();
  return trpc.module.getModuleNames.useSuspenseQuery({ courseName });
};

export const useCreateModuleMutation = () => {
  const { courseName } = useCourseContext();
  const utils = trpc.useUtils();

  return trpc.module.createModule.useMutation({
    onSuccess: () => {
      utils.module.getModuleNames.invalidate({ courseName });
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
  const [moduleNames] = useModuleNamesQuery();
  const [assignments] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.assignment.getAllAssignments({ courseName, moduleName })
    )
  );

  const [quizzes] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.quiz.getAllQuizzes({ courseName, moduleName })
    )
  );
  console.log(quizzes);

  const [pages] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.page.getAllPages({ courseName, moduleName })
    )
  );

  const assignmentsAndModules = moduleNames.flatMap((moduleName, index) => {
    return assignments[index].map((assignment) => ({ moduleName, assignment }));
  });
  const quizzesAndModules = moduleNames.flatMap((moduleName, index) => {
    return quizzes[index].map((quiz) => ({ moduleName, quiz }));
  });
  const pagesAndModules = moduleNames.flatMap((moduleName, index) => {
    return pages[index].map((page) => ({ moduleName, page }));
  });

  return { assignmentsAndModules, quizzesAndModules, pagesAndModules };
};
