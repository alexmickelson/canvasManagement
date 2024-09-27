"use client";
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useCreateItemMutation,
  useDeleteItemMutation,
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

export const useDeleteAssignmentMutation = () =>
  useDeleteItemMutation("Assignment");
