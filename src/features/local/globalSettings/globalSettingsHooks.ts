import { useTRPC } from "@/services/serverFunctions/trpcClient";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useGlobalSettingsQuery = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.globalSettings.getGlobalSettings.queryOptions());
};

export const useUpdateGlobalSettingsMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.globalSettings.updateGlobalSettings.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.globalSettings.getGlobalSettings.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.settings.allCoursesSettings.queryKey(),
        });
      },
    })
  );
};
