"use client";
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import {
  useSuspenseQuery,
  useSuspenseQueries,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";

export const getAssignmentNamesQueryConfig = (
  courseName: string,
  moduleName: string
) => ({
  queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
  queryFn: async (): Promise<string[]> => {
    const url =
      "/api/courses/" +
      encodeURIComponent(courseName) +
      "/modules/" +
      encodeURIComponent(moduleName) +
      "/assignments";
    const response = await axiosClient.get(url);
    return response.data;
  },
});

export const useAssignmentNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(
    getAssignmentNamesQueryConfig(courseName, moduleName)
  );
};

export const getAssignmentQueryConfig = (
  courseName: string,
  moduleName: string,
  assignmentName: string
) => {
  return {
    queryKey: localCourseKeys.assignment(
      courseName,
      moduleName,
      assignmentName
    ),
    queryFn: async () => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments/" +
        encodeURIComponent(assignmentName);
      const response = await axiosClient.get<LocalAssignment>(url);
      return response.data;
    },
  };
};

export const useAssignmentQuery = (
  moduleName: string,
  assignmentName: string
) => {
  const { courseName } = useCourseContext();

  return useSuspenseQuery(
    getAssignmentQueryConfig(courseName, moduleName, assignmentName)
  );
};

export const useAssignmentsQueries = (moduleName: string) => {
  const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
  const { courseName } = useCourseContext();
  return useSuspenseQueries({
    queries: assignmentNames.map((name) =>
      getAssignmentQueryConfig(courseName, moduleName, name)
    ),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};

export const useUpdateAssignmentMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignment,
      moduleName,
      previousModuleName,
      previousAssignmentName,
      assignmentName,
    }: {
      assignment: LocalAssignment;
      moduleName: string;
      previousModuleName: string;
      previousAssignmentName: string;
      assignmentName: string;
    }) => {
      if (
        previousAssignmentName !== assignment.name ||
        previousModuleName !== moduleName
      ) {
        queryClient.removeQueries({
          queryKey: localCourseKeys.assignment(
            courseName,
            previousModuleName,
            previousAssignmentName
          ),
        });
        queryClient.removeQueries({
          queryKey: localCourseKeys.assignmentNames(
            courseName,
            previousModuleName
          ),
        });
      }

      queryClient.setQueryData(
        localCourseKeys.assignment(courseName, moduleName, assignmentName),
        assignment
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments/" +
        encodeURIComponent(assignmentName);
      await axiosClient.put(url, {
        assignment,
        previousModuleName,
        previousAssignmentName,
      });
    },
    onSuccess: async (_, { moduleName, assignmentName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignment(
          courseName,
          moduleName,
          assignmentName
        ),
      });
    },
  });
};

export const useCreateAssignmentMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignment,
      moduleName,
      assignmentName,
    }: {
      assignment: LocalAssignment;
      moduleName: string;
      assignmentName: string;
    }) => {
      queryClient.setQueryData(
        localCourseKeys.assignment(courseName, moduleName, assignmentName),
        assignment
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments/" +
        encodeURIComponent(assignmentName);
      await axiosClient.post(url, assignment);
    },
    onSuccess: async (_, { moduleName, assignmentName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignment(
          courseName,
          moduleName,
          assignmentName
        ),
      });
    },
  });
};

export const useDeleteAssignmentMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleName,
      assignmentName,
    }: {
      moduleName: string;
      assignmentName: string;
    }) => {

      queryClient.removeQueries({
        queryKey: localCourseKeys.assignment(
          courseName,
          moduleName,
          assignmentName
        ),
      });
      queryClient.removeQueries({
        queryKey: localCourseKeys.assignmentNames(
          courseName,
          moduleName
        ),
      });
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments/" +
        encodeURIComponent(assignmentName);
      await axiosClient.delete(url);
    },
    onSuccess: async (_, { moduleName, assignmentName }) => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
      });
    },
  });
};
