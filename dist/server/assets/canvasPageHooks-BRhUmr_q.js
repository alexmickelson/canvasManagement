import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { a as paginatedRequest, i as canvasApi, n as rateLimitAwarePost, o as axiosClient, t as rateLimitAwareDelete } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { a as markdownToHTMLSafe } from "./BreadCrumbs-xctKec6Z.js";
import { a as canvasModuleService, n as useAddCanvasModuleMutation, r as useCanvasModulesQuery } from "./canvasModuleHooks-CfBKJ1j2.js";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/pages/pageHooks.ts
var usePageQuery = (moduleName, pageName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().page.getPage.queryOptions({
		courseName,
		moduleName,
		pageName
	}));
};
var usePagesQueries = (moduleName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().page.getAllPages.queryOptions({
		courseName,
		moduleName
	}));
};
var useUpdatePageMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.page.updatePage.mutationOptions({ onSuccess: (_, { courseName, moduleName, pageName, previousModuleName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.page.getAllPages.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.page.getPage.queryKey({
			courseName,
			moduleName,
			pageName
		}) });
		if (moduleName !== previousModuleName) queryClient.invalidateQueries({ queryKey: trpc.page.getAllPages.queryKey({
			courseName,
			moduleName: previousModuleName
		}) });
	} }));
};
var useCreatePageMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.page.createPage.mutationOptions({ onSuccess: (_, { courseName, moduleName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.page.getAllPages.queryKey({
			courseName,
			moduleName
		}) });
	} }));
};
var useDeletePageMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.page.deletePage.mutationOptions({ onSuccess: (_, { courseName, moduleName, pageName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.page.getAllPages.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.page.getPage.queryKey({
			courseName,
			moduleName,
			pageName
		}) });
	} }));
};
//#endregion
//#region src/features/canvas/services/canvasPageService.ts
var canvasPageService = {
	async getAll(courseId) {
		console.log("requesting pages");
		try {
			return (await paginatedRequest({ url: `${canvasApi}/courses/${courseId}/pages` })).flatMap((pageList) => pageList);
		} catch (error) {
			if (error?.response?.status === 403) {
				console.log("Canvas API error: 403 Forbidden for pages. Returning empty array.");
				return [];
			}
			throw error;
		}
	},
	async create(canvasCourseId, page, settings) {
		console.log(`Creating course page: ${page.name}`);
		const { data: canvasPage } = await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/pages`, { wiki_page: {
			title: page.name,
			body: markdownToHTMLSafe({
				markdownString: page.text,
				settings
			})
		} });
		if (!canvasPage) throw new Error("Created canvas course page was null");
		return canvasPage;
	},
	async update(courseId, canvasPageId, page, settings) {
		console.log(`Updating course page: ${page.name}`);
		const url = `${canvasApi}/courses/${courseId}/pages/${canvasPageId}`;
		const body = { wiki_page: {
			title: page.name,
			body: markdownToHTMLSafe({
				markdownString: page.text,
				settings
			})
		} };
		await axiosClient.put(url, body);
	},
	async delete(courseId, canvasPageId) {
		console.log(`Deleting page from canvas ${canvasPageId}`);
		await rateLimitAwareDelete(`${canvasApi}/courses/${courseId}/pages/${canvasPageId}`);
	}
};
//#endregion
//#region src/features/canvas/hooks/canvasPageHooks.ts
var canvasPageKeys = { pagesInCourse: (courseCanvasId) => [
	"canvas",
	courseCanvasId,
	"pages"
] };
var useCanvasPagesQuery = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	return useQuery({
		queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
		queryFn: async () => await canvasPageService.getAll(settings.canvasId)
	});
};
var useCreateCanvasPageMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	const { data: canvasModules } = useCanvasModulesQuery();
	const addModule = useAddCanvasModuleMutation();
	return useMutation({
		mutationFn: async ({ page, moduleName }) => {
			if (!canvasModules) {
				console.log("cannot add page until modules loaded");
				return;
			}
			const canvasPage = await canvasPageService.create(settings.canvasId, page, settings);
			const canvasModule = canvasModules.find((c) => c.name === moduleName);
			const moduleId = canvasModule ? canvasModule.id : await addModule.mutateAsync(moduleName);
			await canvasModuleService.createPageModuleItem(settings.canvasId, moduleId, page.name, canvasPage);
			return canvasPage;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasPageKeys.pagesInCourse(settings.canvasId) });
		}
	});
};
var useUpdateCanvasPageMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ page, canvasPageId }) => canvasPageService.update(settings.canvasId, canvasPageId, page, settings),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasPageKeys.pagesInCourse(settings.canvasId) });
		}
	});
};
var useDeleteCanvasPageMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (canvasPageId) => canvasPageService.delete(settings.canvasId, canvasPageId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasPageKeys.pagesInCourse(settings.canvasId) });
		}
	});
};
//#endregion
export { useUpdateCanvasPageMutation as a, usePageQuery as c, useDeleteCanvasPageMutation as i, usePagesQueries as l, useCanvasPagesQuery as n, useCreatePageMutation as o, useCreateCanvasPageMutation as r, useDeletePageMutation as s, canvasPageKeys as t, useUpdatePageMutation as u };
