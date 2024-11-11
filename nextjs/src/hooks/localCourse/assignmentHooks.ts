"use client";
import { trpc } from "@/services/trpc/utils";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

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
  const utils = trpc.useUtils();
  return trpc.assignment.updateAssignment.useMutation({
    onSuccess: (
      _,
      { courseName, moduleName, assignmentName, previousAssignmentName }
    ) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
      utils.assignment.getAssignment.invalidate({
        courseName,
        moduleName,
        assignmentName,
      });
      utils.assignment.getAssignment.invalidate({
        courseName,
        moduleName,
        assignmentName: previousAssignmentName,
      });
    },
  });
};

export const useCreateAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.createAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};

export const useDeleteAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.deleteAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};
