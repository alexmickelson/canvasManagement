"use client";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { getErrorMessage } from "@/services/utils/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useClassroom50StatusQuery = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useQuery(
    trpc.classroom50.getStatus.queryOptions(courseName, {
      retry: false,
      staleTime: 60 * 1000,
    })
  );
};

export const useClassroom50EnvironmentQuery = () => {
  const trpc = useTRPC();
  return useQuery(
    trpc.classroom50.getEnvironmentStatus.queryOptions(undefined, {
      retry: false,
      staleTime: 5 * 60 * 1000,
    })
  );
};

export const useClassroom50OrgsQuery = (enabled: boolean = true) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.classroom50.listOrgs.queryOptions(undefined, {
      enabled,
      retry: false,
      staleTime: 5 * 60 * 1000,
    })
  );
};

export const useClassroom50OrgStatusQuery = (org: string | undefined) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.classroom50.getOrgStatus.queryOptions(org ?? "", {
      enabled: !!org,
      retry: false,
      staleTime: 60 * 1000,
    })
  );
};

export const useCreateClassroom50ClassroomMutation = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.classroom50.createClassroom.mutationOptions({
      onError: (error) => toast.error(getErrorMessage(error)),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.classroom50.getStatus.queryKey(courseName),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.classroom50.getOrgStatus.queryKey(),
        });
        // createClassroom also writes the course settings file
        queryClient.invalidateQueries({
          queryKey: trpc.settings.courseSettings.queryKey(courseName),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.settings.allCoursesSettings.queryKey(),
        });
      },
    })
  );
};

export const useSyncClassroom50RosterMutation = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.classroom50.syncRoster.mutationOptions({
      onError: (error) => toast.error(getErrorMessage(error)),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.classroom50.getStatus.queryKey(courseName),
        }),
    })
  );
};

export const useCreateClassroom50AssignmentMutation = () => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.classroom50.createAssignment.mutationOptions({
      onError: (error) => toast.error(getErrorMessage(error)),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.classroom50.getStatus.queryKey(courseName),
        }),
    })
  );
};
