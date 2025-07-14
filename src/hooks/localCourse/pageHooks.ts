"use client";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const usePageQuery = (moduleName: string, pageName: string) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.page.getPage.queryOptions({
      courseName,
      moduleName,
      pageName,
    })
  );
};

export const usePagesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.page.getAllPages.queryOptions({
      courseName,
      moduleName,
    })
  );
};

export const useUpdatePageMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.page.updatePage.mutationOptions({
      onSuccess: (
        _,
        { courseName, moduleName, pageName, previousModuleName }
      ) => {
        queryClient.invalidateQueries({
          queryKey: trpc.page.getAllPages.queryKey({ courseName, moduleName }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.page.getPage.queryKey({
            courseName,
            moduleName,
            pageName,
          }),
        });
        if (moduleName !== previousModuleName) {
          queryClient.invalidateQueries({
            queryKey: trpc.page.getAllPages.queryKey({
              courseName,
              moduleName: previousModuleName,
            }),
          });
        }
      },
    })
  );
};

export const useCreatePageMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.page.createPage.mutationOptions({
      onSuccess: (_, { courseName, moduleName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.page.getAllPages.queryKey({ courseName, moduleName }),
        });
      },
    })
  );
};

export const useDeletePageMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.page.deletePage.mutationOptions({
      onSuccess: (_, { courseName, moduleName, pageName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.page.getAllPages.queryKey({ courseName, moduleName }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.page.getPage.queryKey({
            courseName,
            moduleName,
            pageName,
          }),
        });
      },
    })
  );
};
