import { axiosClient } from "@/services/axiosUtils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getEmptyDirectories } from "./storageDirectoryServerActions";

export const directoryKeys = {
  emptyFolders: ["empty folders"] as const,
};

export const useEmptyDirectoriesQuery = () =>
  useQuery({
    queryKey: directoryKeys.emptyFolders,
    queryFn: async () => await getEmptyDirectories(),
    // queryFn: getEmptyDirectories,
    // async () => {
    //   const url = "/api/directories/empty";
    //   const { data } = await axiosClient.get<string[]>(url);
    //   return data;
    // },
  });
