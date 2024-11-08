"use client";
import { trpc } from "@/services/trpc/utils";
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useDeleteItemMutation,
  useItemQuery,
  useItemsQueries,
  useUpdateItemMutation,
} from "./courseItemHooks";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

// export const getAllAssignmentsQueryConfig = (
//   courseName: string,
//   moduleName: string
// ) => getAllItemsQueryConfig(courseName, moduleName, "Assignment");

// export const getAssignmentQueryConfig = (
//   courseName: string,
//   moduleName: string,
//   assignmentName: string
// ) => getItemQueryConfig(courseName, moduleName, assignmentName, "Assignment");

export const useAssignmentQuery = (
  moduleName: string,
  assignmentName: string
) => {
  const { courseName } = useCourseContext();
  return trpc.assignment.getAssignment.useSuspenseQuery({
    moduleName,
    courseName,
    assignmentName,
  });
};

export const useAssignmentsQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return trpc.assignment.getAllAssignments.useSuspenseQuery({
    moduleName,
    courseName,
  });
};
// useItemsQueries(moduleName, "Assignment");

export const useUpdateAssignmentMutation = () =>
  useUpdateItemMutation("Assignment");

export const useCreateAssignmentMutation = ({
  courseName,
  moduleName,
}: {
  courseName: string;
  moduleName: string;
}) => {
  const utils = trpc.useUtils();
  return trpc.assignment.createAssignment.useMutation({
    onSuccess: () => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};
// useCreateItemMutation("Assignment");

export const useDeleteAssignmentMutation = () =>
  useDeleteItemMutation("Assignment");
