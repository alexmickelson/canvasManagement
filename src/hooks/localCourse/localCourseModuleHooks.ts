import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/serverFunctions/trpcClient";
import { CalendarItemsInterface } from "@/app/course/[courseName]/context/calendarItemsContext";
import {
  getDateOnlyMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/utils/timeUtils";

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

export const useCourseQuizzesByModuleByDateQuery = () => {
  const { courseName } = useCourseContext();
  const [moduleNames] = useModuleNamesQuery();

  const [quizzes] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.quiz.getAllQuizzes({ courseName, moduleName })
    )
  );

  const quizzesAndModules = moduleNames.flatMap((moduleName, index) => {
    return quizzes[index].map((quiz) => ({ moduleName, quiz }));
  });

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
  const [moduleNames] = useModuleNamesQuery();
  const [pages] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.page.getAllPages({ courseName, moduleName })
    )
  );

  const pagesAndModules = moduleNames.flatMap((moduleName, index) => {
    return pages[index].map((page) => ({ moduleName, page }));
  });

  const pagesByModuleByDate = pagesAndModules.reduce(
    (previous, { page, moduleName }) => {
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
  const [moduleNames] = useModuleNamesQuery();
  const [assignments] = trpc.useSuspenseQueries((t) =>
    moduleNames.map((moduleName) =>
      t.assignment.getAllAssignments({ courseName, moduleName })
    )
  );
  const assignmentsAndModules = moduleNames.flatMap((moduleName, index) => {
    return assignments[index].map((assignment) => ({ moduleName, assignment }));
  });
  const assignmentsByModuleByDate = assignmentsAndModules.reduce(
    (previous, { assignment, moduleName }) => {
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
