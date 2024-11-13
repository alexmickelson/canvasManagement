"use client";

import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/trpc/utils";

export const usePageQuery = (moduleName: string, pageName: string) => {
  const { courseName } = useCourseContext();
  return trpc.page.getPage.useSuspenseQuery({
    courseName,
    moduleName,
    pageName,
  });
};

export const usePagesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return trpc.page.getAllPages.useSuspenseQuery({
    courseName,
    moduleName,
  });
};

export const useUpdatePageMutation = () => {
  const utils = trpc.useUtils();
  return trpc.page.updatePage.useMutation({
    onSuccess: (_, { courseName, moduleName, pageName }) => {
      utils.page.getAllPages.invalidate({ courseName, moduleName });
      utils.page.getPage.invalidate({ courseName, moduleName, pageName });
    },
  });
};
export const useCreatePageMutation = () => {
  const utils = trpc.useUtils();
  return trpc.page.createPage.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.page.getAllPages.invalidate({ courseName, moduleName });
    },
  });
};
export const useDeletePageMutation = () => {
  const utils = trpc.useUtils();
  return trpc.page.deletePage.useMutation({
    onSuccess: (_, { courseName, moduleName, pageName }) => {
      utils.page.getAllPages.invalidate(
        { courseName, moduleName },
        {
          refetchType: "all",
        }
      );
      utils.page.getPage.invalidate({ courseName, moduleName, pageName });
    },
  });
};
