import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/globalSettings/globalSettingsHooks.ts
var useGlobalSettingsQuery = () => {
	return useSuspenseQuery(useTRPC().globalSettings.getGlobalSettings.queryOptions());
};
var useUpdateGlobalSettingsMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.globalSettings.updateGlobalSettings.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.globalSettings.getGlobalSettings.queryKey() });
		queryClient.invalidateQueries({ queryKey: trpc.settings.allCoursesSettings.queryKey() });
	} }));
};
//#endregion
export { useUpdateGlobalSettingsMutation as n, useGlobalSettingsQuery as t };
