"use client"
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { useSuspenseQuery, useSuspenseQueries, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

export const useAssignmentNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments";
      const response = await axios.get(url);
      return response.data;
    },
  });
};

const getAssignmentQueryConfig = (
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
    queryFn: async (): Promise<LocalAssignment> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/assignments/" +
        encodeURIComponent(assignmentName);
      const response = await axios.get(url);
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

export const useAssignmentsQueries = (
  moduleName: string,
  assignmentNames: string[]
) => {
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
      await axios.put(url, assignment);
    },
    onSuccess: (_, { moduleName, assignmentName }) => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignment(courseName, moduleName, assignmentName),
      });
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
      });
    },
  });
};