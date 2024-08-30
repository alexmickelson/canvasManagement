import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import { LocalAssignment } from "@/models/local/assignmnet/localAssignment";
import { useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";

export const useAssignmentNamesQuery = (
  courseName: string,
  moduleName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/assignments`;
      const response = await axios.get(url);
      return response.data;
    },
  });

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
      const url = `/api/courses/${courseName}/modules/${moduleName}/assignments/${assignmentName}`;
      const response = await axios.get(url);
      return response.data;
    },
  };
};
export const useAssignmentQuery = (
  courseName: string,
  moduleName: string,
  assignmentName: string
) =>
  useSuspenseQuery(
    getAssignmentQueryConfig(courseName, moduleName, assignmentName)
  );

export const useAssignmentsQueries = (
  courseName: string,
  moduleName: string,
  assignmentNames: string[]
) =>
  useSuspenseQueries({
    queries: assignmentNames.map((name) =>
      getAssignmentQueryConfig(courseName, moduleName, name)
    ),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
