import { trpc } from "@/services/trpc/utils";

export const directoryKeys = {
  emptyFolders: ["empty folders"] as const,
};

export const useEmptyDirectoriesQuery = () =>
  trpc.directories.getEmptyDirectories.useSuspenseQuery();
