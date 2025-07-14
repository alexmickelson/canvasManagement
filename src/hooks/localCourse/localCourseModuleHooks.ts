import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { CalendarItemsInterface } from "@/app/course/[courseName]/context/calendarItemsContext";
import {
  getDateOnlyMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/utils/timeUtils";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";

export const useModuleNamesQuery = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.module.getModuleNames.queryOptions({ courseName })
  );
};

export const useCreateModuleMutation = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.module.createModule.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.module.getModuleNames.queryKey({ courseName }),
        });
      },
    })
  );
};

export const useCourseQuizzesByModuleByDateQuery = () => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();
  const trpc = useTRPC();
  const quizzesResults = useSuspenseQueries({
    queries: moduleNames.map((moduleName: string) =>
      trpc.quiz.getAllQuizzes.queryOptions({ courseName, moduleName })
    ),
  });
  const quizzes = quizzesResults.map((result) => result.data ?? []);
  const quizzesAndModules = moduleNames.flatMap(
    (moduleName: string, index: number) => {
      return quizzes[index].map((quiz) => ({ moduleName, quiz }));
    }
  );
  const quizzesByModuleByDate = quizzesAndModules.reduce(
    (previous, { quiz, moduleName }) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(quiz.dueAt, "due at for quiz in items context")
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        quizzes: [],
      };
      const updatedModule = {
        ...previousModule,
        quizzes: [...previousModule.quizzes, quiz],
      };
      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );
  return quizzesByModuleByDate;
};

export const useCoursePagesByModuleByDateQuery = () => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();
  const trpc = useTRPC();
  const pagesResults = useSuspenseQueries({
    queries: moduleNames.map((moduleName: string) =>
      trpc.page.getAllPages.queryOptions({ courseName, moduleName })
    ),
  });
  const pages = pagesResults.map((result) => result.data ?? []);
  const pagesAndModules = moduleNames.flatMap(
    (moduleName: string, index: number) => {
      return pages[index].map((page) => ({ moduleName, page }));
    }
  );
  const pagesByModuleByDate = pagesAndModules.reduce(
    (
      previous,
      { page, moduleName }
    ) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(page.dueAt, "due at for page in items context")
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        pages: [],
      };
      const updatedModule = {
        ...previousModule,
        pages: [...previousModule.pages, page],
      };
      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );
  return pagesByModuleByDate;
};

export const useCourseAssignmentsByModuleByDateQuery = () => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();
  const trpc = useTRPC();
  const assignmentsResults = useSuspenseQueries({
    queries: moduleNames.map((moduleName: string) =>
      trpc.assignment.getAllAssignments.queryOptions({ courseName, moduleName })
    ),
  });
  const assignments = assignmentsResults.map(
    (result) => result.data
  );
  const assignmentsAndModules = moduleNames.flatMap(
    (moduleName: string, index: number) => {
      return assignments[index].map((assignment) => ({
        moduleName,
        assignment,
      }));
    }
  );
  const assignmentsByModuleByDate = assignmentsAndModules.reduce(
    (
      previous,
      { assignment, moduleName }
    ) => {
      const dueDay = getDateOnlyMarkdownString(
        getDateFromStringOrThrow(
          assignment.dueAt,
          "due at for assignment in items context"
        )
      );
      const previousModules = previous[dueDay] ?? {};
      const previousModule = previousModules[moduleName] ?? {
        assignments: [],
      };
      const updatedModule = {
        ...previousModule,
        assignments: [...previousModule.assignments, assignment],
      };
      return {
        ...previous,
        [dueDay]: {
          ...previousModules,
          [moduleName]: updatedModule,
        },
      };
    },
    {} as CalendarItemsInterface
  );
  return assignmentsByModuleByDate;
};
