import { a as paginatedRequest, i as canvasApi, n as rateLimitAwarePost, o as axiosClient } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//#region src/features/canvas/services/canvasModuleService.ts
var canvasModuleService = {
	async updateModuleItem(canvasCourseId, canvasModuleId, item) {
		console.log(`Updating module item ${item.title}`);
		const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items/${item.id}`;
		const body = { module_item: {
			title: item.title,
			position: item.position
		} };
		const { data } = await axiosClient.put(url, body);
		if (!data) throw new Error("Something went wrong updating module item");
	},
	async getModuleWithItems(canvasCourseId, moduleId) {
		const url = `${canvasApi}/courses/${canvasCourseId}/modules/${moduleId}`;
		return (await axiosClient.get(url, { params: { include: ["items"] } })).data;
	},
	async createModuleItem(canvasCourseId, canvasModuleId, title, type, contentId) {
		console.log(`Creating new module item ${title}`);
		await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`, { module_item: {
			title,
			type,
			content_id: contentId
		} });
	},
	async createPageModuleItem(canvasCourseId, canvasModuleId, title, canvasPage) {
		console.log(`Creating new module item ${title}`);
		await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`, { module_item: {
			title,
			type: "Page",
			page_url: canvasPage.url
		} });
	},
	async getCourseModules(canvasCourseId) {
		return await paginatedRequest({ url: `${canvasApi}/courses/${canvasCourseId}/modules` });
	},
	async createModule(canvasCourseId, moduleName) {
		return (await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/modules`, { module: { name: moduleName } })).data.id;
	},
	async reorderModuleItems(canvasCourseId, canvasModuleId, itemIds) {
		for (let i = 0; i < itemIds.length; i++) {
			const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items/${itemIds[i]}`;
			const body = { module_item: { position: i + 1 } };
			await axiosClient.put(url, body);
		}
	}
};
//#endregion
//#region src/features/canvas/hooks/canvasModuleHooks.ts
var canvasCourseModuleKeys = { modules: (canvasId) => [
	"canvas",
	canvasId,
	"module list"
] };
var useCanvasModulesQuery = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	return useQuery({
		queryKey: canvasCourseModuleKeys.modules(settings.canvasId),
		queryFn: async () => await canvasModuleService.getCourseModules(settings.canvasId)
	});
};
var useAddCanvasModuleMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (moduleName) => await canvasModuleService.createModule(settings.canvasId, moduleName),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasCourseModuleKeys.modules(settings.canvasId) });
		}
	});
};
var useReorderCanvasModuleItemsMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ moduleId, items }) => {
			if (!settings?.canvasId) throw new Error("No canvasId in settings");
			const canvasModule = await canvasModuleService.getModuleWithItems(settings.canvasId, moduleId);
			if (!canvasModule.items) throw new Error("cannot sort canvas module items, no items found in module");
			const canvasItems = canvasModule.items;
			const orderedIds = [...items].sort((a, b) => {
				return (a.dueAt ? new Date(a.dueAt).getTime() : 0) - (b.dueAt ? new Date(b.dueAt).getTime() : 0);
			}).map((localItem) => canvasItems.find((canvasItem) => canvasItem.title === localItem.name)?.id).filter((id) => typeof id === "number");
			return await canvasModuleService.reorderModuleItems(settings.canvasId, moduleId, orderedIds);
		},
		onSuccess: (_data) => {
			if (!settings?.canvasId) return;
			queryClient.invalidateQueries({ queryKey: canvasCourseModuleKeys.modules(settings.canvasId) });
		}
	});
};
//#endregion
export { canvasModuleService as a, useReorderCanvasModuleItemsMutation as i, useAddCanvasModuleMutation as n, useCanvasModulesQuery as r, canvasCourseModuleKeys as t };
