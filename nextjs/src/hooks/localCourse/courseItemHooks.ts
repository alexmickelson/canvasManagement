import { axiosClient } from "@/services/axiosUtils";
import { localCourseKeys } from "./localCourseKeys";
import {
  CourseItemReturnType,
  CourseItemType,
  typeToFolder,
} from "@/models/local/courseItemTypes";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getAllItemsFromServer,
  getItemFromServer,
} from "./courseItemServerActions";
import { useRouter } from "next/navigation";

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
    // return await getAllItemsFromServer({
    //   courseName,
    //   moduleName,
    //   type,
    // });
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
      // return await getItemFromServer({
      //   moduleName,
      //   courseName,
      //   itemName: name,
      //   type,
      // });
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
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};

export const useUpdateItemMutation = <T extends CourseItemType>(type: T) => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      item,
      moduleName,
      previousModuleName,
      previousItemName,
      itemName,
    }: {
      item: CourseItemReturnType<T>;
      moduleName: string;
      previousModuleName: string;
      previousItemName: string;
      itemName: string;
    }) => {
      if (previousItemName !== item.name || previousModuleName !== moduleName) {
        queryClient.removeQueries({
          queryKey: localCourseKeys.itemOfType(
            courseName,
            previousModuleName,
            previousItemName,
            type
          ),
        });
        queryClient.removeQueries({
          queryKey: localCourseKeys.allItemsOfType(
            courseName,
            previousModuleName,
            type
          ),
        });
      }

      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, itemName, type),
        item
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/" +
        typeToFolder[type] +
        "/" +
        encodeURIComponent(itemName);
      if (type === "Assignment")
        await axiosClient.put(url, {
          assignment: item,
          previousModuleName,
          previousAssignmentName: previousItemName,
        });
      if (type === "Quiz")
        await axiosClient.put(url, {
          quiz: item,
          previousModuleName,
          previousQuizName: previousItemName,
        });
      if (type === "Page")
        await axiosClient.put(url, {
          page: item,
          previousModuleName,
          previousPageName: previousItemName,
        });
    },
    onSuccess: async (_, { moduleName, itemName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          itemName,
          type
        ),
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
        refetchType: "all",
      });
    },
  });
};

export const useCreateItemMutation = <T extends CourseItemType>(type: T) => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      item,
      moduleName,
      itemName,
    }: {
      item: CourseItemReturnType<T>;
      moduleName: string;
      itemName: string;
    }) => {
      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, itemName, type),
        item
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/" +
        typeToFolder[type] +
        "/" +
        encodeURIComponent(itemName);
      await axiosClient.post(url, item);
    },
    onSuccess: async (_, { moduleName, itemName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          itemName,
          type
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
      });
    },
  });
};

export const useDeleteItemMutation = <T extends CourseItemType>(type: T) => {
  const { courseName } = useCourseContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleName,
      itemName,
    }: {
      moduleName: string;
      itemName: string;
    }) => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/" +
        typeToFolder[type] +
        "/" +
        encodeURIComponent(itemName);
      await axiosClient.delete(url);
    },
    onSuccess: async (_, { moduleName, itemName }) => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
        // refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          itemName,
          type
        ),
        refetchType: "none",
      });
    },
  });
};
