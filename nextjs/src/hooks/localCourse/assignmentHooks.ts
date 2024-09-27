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
  useCreateItemMutation,
  useItemQuery,
  useItemsQueries,
  useUpdateItemMutation,
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

export const useUpdateAssignmentMutation = () =>
  useUpdateItemMutation("Assignment");

export const useCreateAssignmentMutation = () =>
  useCreateItemMutation("Assignment");

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
