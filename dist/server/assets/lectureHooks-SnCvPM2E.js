import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/lectures/lectureHooks.ts
var useLecturesSuspenseQuery = () => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().lectures.getLectures.queryOptions({ courseName }));
};
var useLectureUpdateMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.lectures.updateLecture.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.lectures.getLectures.queryKey() });
	} }));
};
var useDeleteLectureMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.lectures.deleteLecture.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.lectures.getLectures.queryKey() });
	} }));
};
//#endregion
export { useLectureUpdateMutation as n, useLecturesSuspenseQuery as r, useDeleteLectureMutation as t };
