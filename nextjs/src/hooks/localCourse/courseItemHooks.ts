import { axiosClient } from "@/services/axiosUtils";
import { localCourseKeys } from "./localCourseKeys";
import {
  CourseItemReturnType,
  CourseItemType,
  typeToFolder,
} from "@/models/local/courseItemTypes";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";

export const getAllItemsQueryConfig = <T extends CourseItemType>(
  courseName: string,
  moduleName: string,
  type: T
) => ({
  queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
  queryFn: async (): Promise<CourseItemReturnType<T>[]> => {
    const url =
      "/api/courses/" +
      encodeURIComponent(courseName) +
      "/modules/" +
      encodeURIComponent(moduleName) +
      "/" +
      typeToFolder[type];
    const response = await axiosClient.get(url);
    return response.data;
  },
});

export const getItemQueryConfig = <T extends CourseItemType>(
  courseName: string,
  moduleName: string,
  name: string,
  type: T
) => {
  return {
    queryKey: localCourseKeys.itemOfType(courseName, moduleName, name, type),
    queryFn: async () => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/" +
        typeToFolder[type] +
        "/" +
        encodeURIComponent(name);
      const response = await axiosClient.get<CourseItemReturnType<T>>(url);
      return response.data;
    },
  };
};

export const useItemQuery = <T extends CourseItemType>(
  moduleName: string,
  name: string,
  type: T
) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(
    getItemQueryConfig(courseName, moduleName, name, type)
  );
};

const useAllItemsQuery = <T extends CourseItemType>(
  moduleName: string,
  type: T
) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getAllItemsQueryConfig(courseName, moduleName, type));
};

export const useItemsQueries = <T extends CourseItemType>(
  moduleName: string,
  type: T
) => {
  const { data: allItems } = useAllItemsQuery(moduleName, type);
  const { courseName } = useCourseContext();
  return useSuspenseQueries({
    queries: allItems.map((item) => ({
      ...getItemQueryConfig(courseName, moduleName, item.name, type),
      queryFn: () => item,
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};
