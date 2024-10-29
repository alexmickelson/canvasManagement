import { axiosClient } from "@/services/axiosUtils";
import { useSuspenseQuery } from "@tanstack/react-query";

export const directoryKeys = {
  emptyFolders: ["empty folders"] as const,
};

export const useEmptyDirectoriesQuery = () =>
  useSuspenseQuery({
    queryKey: directoryKeys.emptyFolders,
    queryFn: getEmptyDirectories
    // async () => {
    //   const url = "/api/directories/empty";
    //   const { data } = await axiosClient.get<string[]>(url);
    //   return data;
    // },
  });
