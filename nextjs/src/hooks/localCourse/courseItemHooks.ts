import { localCourseKeys } from "./localCourseKeys";
import {
  CourseItemReturnType,
  CourseItemType,
} from "@/models/local/courseItemTypes";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createItemOnServer,
  deleteItemOnServer,
  getAllItemsFromServer,
  getItemFromServer,
  updateItemOnServer,
} from "./courseItemServerActions";

export const getAllItemsQueryConfig = <T extends CourseItemType>(
  courseName: string,
  moduleName: string,
  type: T
) => ({
  queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
  queryFn: async (): Promise<CourseItemReturnType<T>[]> => {
    return await getAllItemsFromServer({
      courseName,
      moduleName,
      type,
    });
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
      return await getItemFromServer({
        moduleName,
        courseName,
        itemName: name,
        type,
      });
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
      await updateItemOnServer({
        courseName,
        moduleName,
        item,
        type,
        previousItemName,
        previousModuleName,
        itemName,
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
      await createItemOnServer({
        courseName,
        moduleName,
        item,
        type,
        itemName,
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
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
      });
    },
  });
};

export const useDeleteItemMutation = <T extends CourseItemType>(type: T) => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleName,
      itemName,
    }: {
      moduleName: string;
      itemName: string;
    }) => {
      await deleteItemOnServer({
        courseName,
        itemName,
        moduleName,
        type,
      });
    },
    onSuccess: async (_, { moduleName, itemName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, type),
        // refetchType: "all",
      });
      await queryClient.invalidateQueries({
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
