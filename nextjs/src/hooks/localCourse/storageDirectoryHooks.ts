import { trpc } from "@/services/serverFunctions/trpcClient";

export const directoryKeys = {
  emptyFolders: ["empty folders"] as const,
};

export const useEmptyDirectoriesQuery = () =>
  trpc.directories.getEmptyDirectories.useSuspenseQuery();
