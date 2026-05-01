import { a as useTRPC } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { i as useUpdateLocalCourseSettingsMutation, n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { i as extractImageSources } from "./BreadCrumbs-xctKec6Z.js";
import { a as canvasModuleService, n as useAddCanvasModuleMutation, r as useCanvasModulesQuery } from "./canvasModuleHooks-CfBKJ1j2.js";
import { t as canvasAssignmentService } from "./canvasAssignmentService-intGhTQJ.js";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
//#region src/features/local/assignments/assignmentHooks.ts
var useAssignmentQuery = (moduleName, assignmentName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery(useTRPC().assignment.getAssignment.queryOptions({
		moduleName,
		courseName,
		assignmentName
	}));
};
var useUpdateImageSettingsForAssignment = ({ moduleName, assignmentName }) => {
	const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
	const [isPending, setIsPending] = useState(false);
	useAddNewImagesToCanvasMutation();
	useEffect(() => {
		console.log("not uploading images, NEXT_PUBLIC_ENABLE_FILE_SYNC is not set to true");
	}, [assignment.description, isPending]);
	return { isPending };
};
var useAddNewImagesToCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const createCanvasUrlMutation = useMutation(useTRPC().canvasFile.getCanvasFileUrl.mutationOptions());
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	return useMutation({ mutationFn: async ({ markdownString }) => {
		const newImages = extractImageSources(markdownString).filter((source) => settings.assets.every((a) => a.sourceUrl !== source));
		if (newImages.length === 0) {
			console.log("no new images to upload");
			return;
		}
		const newAssets = await Promise.all(newImages.map(async (source) => {
			console.log("uploading image to canvas", source);
			const canvasUrl = await createCanvasUrlMutation.mutateAsync({
				sourceUrl: source,
				canvasCourseId: settings.canvasId
			});
			console.log("got canvas url", source, canvasUrl);
			return {
				sourceUrl: source,
				canvasUrl
			};
		}));
		await updateSettings.mutateAsync({ settings: {
			...settings,
			assets: [...settings.assets, ...newAssets]
		} });
	} });
};
var useAssignmentNamesQuery = (moduleName) => {
	const { courseName } = useCourseContext();
	return useSuspenseQuery({
		...useTRPC().assignment.getAllAssignments.queryOptions({
			moduleName,
			courseName
		}),
		select: (assignments) => assignments.map((a) => a.name)
	});
};
var useUpdateAssignmentMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.assignment.updateAssignment.mutationOptions({ onSuccess: (_, { courseName, moduleName, assignmentName, previousAssignmentName, previousModuleName }) => {
		if (moduleName !== previousModuleName) queryClient.invalidateQueries({ queryKey: trpc.assignment.getAllAssignments.queryKey({
			courseName,
			moduleName: previousModuleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAllAssignments.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAssignment.queryKey({
			courseName,
			moduleName,
			assignmentName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAssignment.queryKey({
			courseName,
			moduleName,
			assignmentName: previousAssignmentName
		}) });
	} }));
};
var useCreateAssignmentMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.assignment.createAssignment.mutationOptions({ onSuccess: (_result, { courseName, moduleName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAllAssignments.queryKey({
			courseName,
			moduleName
		}) });
	} }));
};
var useDeleteAssignmentMutation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(trpc.assignment.deleteAssignment.mutationOptions({ onSuccess: (_result, { courseName, moduleName, assignmentName }) => {
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAllAssignments.queryKey({
			courseName,
			moduleName
		}) });
		queryClient.invalidateQueries({ queryKey: trpc.assignment.getAssignment.queryKey({
			courseName,
			moduleName,
			assignmentName
		}) });
	} }));
};
//#endregion
//#region src/features/canvas/hooks/canvasAssignmentHooks.ts
var canvasAssignmentKeys = { assignments: (canvasCourseId) => [
	"canvas",
	canvasCourseId,
	"assignments"
] };
var useCanvasAssignmentsQuery = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	return useQuery({
		queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
		queryFn: async () => canvasAssignmentService.getAll(settings.canvasId)
	});
};
var useAddAssignmentToCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: canvasModules } = useCanvasModulesQuery();
	const addModule = useAddCanvasModuleMutation();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ assignment, moduleName }) => {
			if (!canvasModules) throw new Error("cannot add assignment until modules loaded");
			const assignmentGroup = settings.assignmentGroups.find((g) => g.name === assignment.localAssignmentGroupName);
			const canvasAssignmentId = await canvasAssignmentService.create(settings.canvasId, assignment, settings, assignmentGroup?.canvasId);
			const canvasModule = canvasModules.find((c) => c.name === moduleName);
			const moduleId = canvasModule ? canvasModule.id : await addModule.mutateAsync(moduleName);
			await canvasModuleService.createModuleItem(settings.canvasId, moduleId, assignment.name, "Assignment", canvasAssignmentId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
		}
	});
};
var useUpdateAssignmentInCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ assignment, canvasAssignmentId }) => {
			const assignmentGroup = settings.assignmentGroups.find((g) => g.name === assignment.localAssignmentGroupName);
			await canvasAssignmentService.update(settings.canvasId, canvasAssignmentId, assignment, settings, assignmentGroup?.canvasId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
		}
	});
};
var useDeleteAssignmentFromCanvasMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ canvasAssignmentId, assignmentName }) => {
			await canvasAssignmentService.delete(settings.canvasId, canvasAssignmentId, assignmentName);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
		}
	});
};
//#endregion
export { useUpdateAssignmentInCanvasMutation as a, useCreateAssignmentMutation as c, useUpdateImageSettingsForAssignment as d, useDeleteAssignmentFromCanvasMutation as i, useDeleteAssignmentMutation as l, useAddAssignmentToCanvasMutation as n, useAssignmentNamesQuery as o, useCanvasAssignmentsQuery as r, useAssignmentQuery as s, canvasAssignmentKeys as t, useUpdateAssignmentMutation as u };
