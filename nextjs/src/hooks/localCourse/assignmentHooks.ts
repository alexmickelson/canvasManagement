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

export const getAllAssignmentsQueryConfig = (
  courseName: string,
  moduleName: string
) => ({
  queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Assignment"),
  queryFn: async (): Promise<LocalAssignment[]> => {
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

const useAllAssignmentsQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getAllAssignmentsQueryConfig(courseName, moduleName));
};

export const getAssignmentQueryConfig = (
  courseName: string,
  moduleName: string,
  assignmentName: string
) => {
  return {
    queryKey: localCourseKeys.itemOfType(
      courseName,
      moduleName,
      assignmentName,
      "Assignment"
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
  const { data: allAssignments } = useAllAssignmentsQuery(moduleName);
  const { courseName } = useCourseContext();
  return useSuspenseQueries({
    queries: allAssignments.map((assignment) =>
      getAssignmentQueryConfig(courseName, moduleName, assignment.name)
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
          queryKey: localCourseKeys.itemOfType(
            courseName,
            previousModuleName,
            previousAssignmentName,
            "Assignment"
          ),
        });
        queryClient.removeQueries({
          queryKey:  localCourseKeys.allItemsOfType(
            courseName,
            previousModuleName,
            "Assignment"
          ),
        });
      }

      queryClient.setQueryData(
       localCourseKeys.itemOfType(
          courseName,
          moduleName,
          assignmentName,
          "Assignment"
        ),
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
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Assignment"),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          assignmentName,
          "Assignment"
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
        localCourseKeys.itemOfType(
          courseName,
          moduleName,
          assignmentName,
          "Assignment"
        ),
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
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Assignment"),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          assignmentName,
          "Assignment"
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
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          assignmentName,
          "Assignment"
        ),
      });
      queryClient.removeQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Assignment"),
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
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Assignment"),
      });
    },
  });
};
