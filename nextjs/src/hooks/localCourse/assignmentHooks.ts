"use client";
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
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useItemQuery,
  useItemsQueries,
} from "./courseItemHooks";

export const getAllAssignmentsQueryConfig = (
  courseName: string,
  moduleName: string
) => getAllItemsQueryConfig(courseName, moduleName, "Assignment");

export const getAssignmentQueryConfig = (
  courseName: string,
  moduleName: string,
  assignmentName: string
) => getItemQueryConfig(courseName, moduleName, assignmentName, "Assignment");

export const useAssignmentQuery = (
  moduleName: string,
  assignmentName: string
) => useItemQuery(moduleName, assignmentName, "Assignment");

export const useAssignmentsQueries = (moduleName: string) =>
  useItemsQueries(moduleName, "Assignment");

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
          queryKey: localCourseKeys.allItemsOfType(
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
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Assignment"
        ),
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
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Assignment"
        ),
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
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Assignment"
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
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Assignment"
        ),
      });
    },
  });
};
