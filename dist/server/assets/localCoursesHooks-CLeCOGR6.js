import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/course/localCoursesHooks.ts
var useLocalCoursesSettingsQuery = () => {
	return useSuspenseQuery(useTRPC().settings.allCoursesSettings.queryOptions());
};
var useLocalCourseSettingsQuery = () => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().settings.courseSettings.queryOptions({ courseName }));
};
var useCreateLocalCourseMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.settings.createCourse.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.settings.allCoursesSettings.queryKey() });
		queryClient.invalidateQueries({ queryKey: trpc.directories.getEmptyDirectories.queryKey() });
		queryClient.invalidateQueries({ queryKey: trpc.globalSettings.getGlobalSettings.queryKey() });
	} }));
};
var useUpdateLocalCourseSettingsMutation = () => {
	const { courseName } = useCourseContext();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.settings.updateSettings.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.settings.allCoursesSettings.queryKey() });
		queryClient.invalidateQueries({ queryKey: trpc.settings.courseSettings.queryKey({ courseName }) });
	} }));
};
//#endregion
export { useUpdateLocalCourseSettingsMutation as i, useLocalCourseSettingsQuery as n, useLocalCoursesSettingsQuery as r, useCreateLocalCourseMutation as t };
