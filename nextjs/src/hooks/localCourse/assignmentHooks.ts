"use client";
import { trpc } from "@/services/serverFunctions/trpcClient";
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

export const useAssignmentNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return trpc.assignment.getAllAssignments.useSuspenseQuery(
    {
      moduleName,
      courseName,
    },
    {
      select: (assignments) => assignments.map((a) => a.name),
    }
  );
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
    onSuccess: (_, { courseName, moduleName, assignmentName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
      utils.assignment.getAssignment.invalidate(
        {
          courseName,
          moduleName,
          assignmentName,
        },
        {
          refetchType: "all",
        }
      );
    },
  });
};
