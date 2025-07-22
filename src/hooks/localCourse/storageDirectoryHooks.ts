import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const directoryKeys = {
  emptyFolders: ["empty folders"] as const,
};

export const useEmptyDirectoriesQuery = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.directories.getEmptyDirectories.queryOptions());
};

export const useDirectoryContentsQuery = (relativePath: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.directories.getDirectoryContents.queryOptions({ relativePath })
  );
};
