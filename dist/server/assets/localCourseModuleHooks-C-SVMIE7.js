import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { a as getDateOnlyMarkdownString, r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { useMutation, useQueryClient, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/modules/localCourseModuleHooks.ts
var useModuleNamesQuery = () => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().module.getModuleNames.queryOptions({ courseName }));
};
var useCreateModuleMutation = () => {
	const { courseName } = useCourseContext();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.module.createModule.mutationOptions({ onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: trpc.module.getModuleNames.queryKey({ courseName }) });
	} }));
};
var useCourseQuizzesByModuleByDateQuery = () => {
	const { courseName } = useCourseContext();
	const { data: moduleNames } = useModuleNamesQuery();
	const trpc = useTRPC();
	const quizzes = useSuspenseQueries({ queries: moduleNames.map((moduleName) => trpc.quiz.getAllQuizzes.queryOptions({
		courseName,
		moduleName
	})) }).map((result) => result.data ?? []);
	return moduleNames.flatMap((moduleName, index) => {
		return quizzes[index].map((quiz) => ({
			moduleName,
			quiz
		}));
	}).reduce((previous, { quiz, moduleName }) => {
		const dueDay = getDateOnlyMarkdownString(getDateFromStringOrThrow(quiz.dueAt, "due at for quiz in items context"));
		const previousModules = previous[dueDay] ?? {};
		const previousModule = previousModules[moduleName] ?? { quizzes: [] };
		const updatedModule = {
			...previousModule,
			quizzes: [...previousModule.quizzes, quiz]
		};
		return {
			...previous,
			[dueDay]: {
				...previousModules,
				[moduleName]: updatedModule
			}
		};
	}, {});
};
var useCoursePagesByModuleByDateQuery = () => {
	const { courseName } = useCourseContext();
	const { data: moduleNames } = useModuleNamesQuery();
	const trpc = useTRPC();
	const pages = useSuspenseQueries({ queries: moduleNames.map((moduleName) => trpc.page.getAllPages.queryOptions({
		courseName,
		moduleName
	})) }).map((result) => result.data ?? []);
	return moduleNames.flatMap((moduleName, index) => {
		return pages[index].map((page) => ({
			moduleName,
			page
		}));
	}).reduce((previous, { page, moduleName }) => {
		const dueDay = getDateOnlyMarkdownString(getDateFromStringOrThrow(page.dueAt, "due at for page in items context"));
		const previousModules = previous[dueDay] ?? {};
		const previousModule = previousModules[moduleName] ?? { pages: [] };
		const updatedModule = {
			...previousModule,
			pages: [...previousModule.pages, page]
		};
		return {
			...previous,
			[dueDay]: {
				...previousModules,
				[moduleName]: updatedModule
			}
		};
	}, {});
};
var useCourseAssignmentsByModuleByDateQuery = () => {
	const { courseName } = useCourseContext();
	const { data: moduleNames } = useModuleNamesQuery();
	const trpc = useTRPC();
	const assignments = useSuspenseQueries({ queries: moduleNames.map((moduleName) => trpc.assignment.getAllAssignments.queryOptions({
		courseName,
		moduleName
	})) }).map((result) => result.data);
	return moduleNames.flatMap((moduleName, index) => {
		return assignments[index].map((assignment) => ({
			moduleName,
			assignment
		}));
	}).reduce((previous, { assignment, moduleName }) => {
		const dueDay = getDateOnlyMarkdownString(getDateFromStringOrThrow(assignment.dueAt, "due at for assignment in items context"));
		const previousModules = previous[dueDay] ?? {};
		const previousModule = previousModules[moduleName] ?? { assignments: [] };
		const updatedModule = {
			...previousModule,
			assignments: [...previousModule.assignments, assignment]
		};
		return {
			...previous,
			[dueDay]: {
				...previousModules,
				[moduleName]: updatedModule
			}
		};
	}, {});
};
//#endregion
export { useModuleNamesQuery as a, useCreateModuleMutation as i, useCoursePagesByModuleByDateQuery as n, useCourseQuizzesByModuleByDateQuery as r, useCourseAssignmentsByModuleByDateQuery as t };
