"use client";
import { trpc } from "@/services/trpc/utils";
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
  console.log("rendering all assignments query");
  return trpc.assignment.getAllAssignments.useSuspenseQuery({
    moduleName,
    courseName,
  });
};

export const useUpdateAssignmentMutation = () => {
  return trpc.assignment.updateAssignment.useMutation();
};

export const useCreateAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.createAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};
// useCreateItemMutation("Assignment");

export const useDeleteAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.deleteAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};
