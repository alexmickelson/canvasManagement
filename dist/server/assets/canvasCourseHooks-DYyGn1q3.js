import { a as paginatedRequest, i as canvasApi, n as rateLimitAwarePost, o as axiosClient, t as rateLimitAwareDelete } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { i as useUpdateLocalCourseSettingsMutation } from "./localCoursesHooks-CLeCOGR6.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
//#region src/components/form/SelectInput.tsx
function SelectInput({ value, setValue, label, options, getOptionName, emptyOptionText }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [
			label,
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsxs("select", {
				className: "bg-slate-800 rounded-md  px-1",
				value: value ? getOptionName(value) : "",
				onChange: (e) => {
					const optionName = e.target.value;
					setValue(options.find((o) => getOptionName(o) === optionName));
				},
				children: [
					/* @__PURE__ */ jsx("option", {}),
					emptyOptionText && /* @__PURE__ */ jsx("option", { children: emptyOptionText }),
					options.map((o) => /* @__PURE__ */ jsx("option", { children: getOptionName(o) }, getOptionName(o)))
				]
			})
		]
	});
}
//#endregion
//#region src/features/canvas/services/canvasAssignmentGroupService.ts
var canvasAssignmentGroupService = {
	async getAll(courseId) {
		console.log("Requesting assignment groups");
		return (await paginatedRequest({ url: `${canvasApi}/courses/${courseId}/assignment_groups` })).flatMap((groupList) => groupList);
	},
	async create(canvasCourseId, localAssignmentGroup) {
		console.log(`Creating assignment group: ${localAssignmentGroup.name}`);
		const { data: canvasAssignmentGroup } = await rateLimitAwarePost(`${canvasApi}/courses/${canvasCourseId}/assignment_groups`, {
			name: localAssignmentGroup.name,
			group_weight: localAssignmentGroup.weight
		});
		return {
			...localAssignmentGroup,
			canvasId: canvasAssignmentGroup.id
		};
	},
	async update(canvasCourseId, localAssignmentGroup) {
		console.log(`Updating assignment group: ${localAssignmentGroup.name}, ${localAssignmentGroup.canvasId}`);
		if (!localAssignmentGroup.canvasId) throw new Error("Cannot update assignment group if canvas ID is null");
		const url = `${canvasApi}/courses/${canvasCourseId}/assignment_groups/${localAssignmentGroup.canvasId}`;
		const body = {
			name: localAssignmentGroup.name,
			group_weight: localAssignmentGroup.weight
		};
		await axiosClient.put(url, body);
	},
	async delete(canvasCourseId, canvasAssignmentGroupId, assignmentGroupName) {
		console.log(`Deleting assignment group: ${assignmentGroupName}`);
		await rateLimitAwareDelete(`${canvasApi}/courses/${canvasCourseId}/assignment_groups/${canvasAssignmentGroupId}`);
	}
};
//#endregion
//#region src/features/canvas/services/canvasService.ts
var getAllTerms = async () => {
	return (await paginatedRequest({ url: `${canvasApi}/accounts/10/terms?per_page=100` })).flatMap((t) => t.enrollment_terms);
};
var canvasService = {
	getAllTerms,
	async getCourses(termId) {
		return (await paginatedRequest({ url: `${canvasApi}/courses?per_page=100` })).flatMap((l) => l).filter((c) => c.enrollment_term_id === termId);
	},
	async getCourse(courseId) {
		const url = `${canvasApi}/courses/${courseId}`;
		const { data } = await axiosClient.get(url);
		return data;
	},
	async getCurrentTermsFor(queryDate = /* @__PURE__ */ new Date()) {
		return (await getAllTerms()).filter((t) => t.end_at && new Date(t.end_at) > queryDate && new Date(t.end_at) < new Date(queryDate.setFullYear(queryDate.getFullYear() + 1))).sort((a, b) => new Date(a.start_at ?? "").getTime() - new Date(b.start_at ?? "").getTime()).slice(0, 3);
	},
	async getEnrolledStudents(canvasCourseId) {
		console.log(`Getting students for course ${canvasCourseId}`);
		const data = await paginatedRequest({ url: `${canvasApi}/courses/${canvasCourseId}/users?enrollment_type=student` });
		if (!data) throw new Error(`Something went wrong getting enrollments for ${canvasCourseId}`);
		return data;
	}
};
//#endregion
//#region src/features/canvas/hooks/canvasCourseHooks.ts
var canvasCourseKeys = {
	courseDetails: (canavasId) => [
		"canvas",
		canavasId,
		"course details"
	],
	assignmentGroups: (canavasId) => [
		"canvas",
		canavasId,
		"assignment groups"
	],
	courseListInTerm: (canvasTermId) => ["canvas courses in term", canvasTermId],
	students: (canvasId) => ["students in canvas course", canvasId]
};
var useCourseListInTermQuery = (canvasTermId) => useQuery({
	queryKey: canvasCourseKeys.courseListInTerm(canvasTermId),
	queryFn: async () => canvasTermId ? await canvasService.getCourses(canvasTermId) : [],
	enabled: !!canvasTermId
});
var useSetAssignmentGroupsMutation = (canvasId) => {
	const updateSettingsMutation = useUpdateLocalCourseSettingsMutation();
	const { data: canvasAssignmentGroups } = useAssignmentGroupsQuery(canvasId);
	return useMutation({ mutationFn: async (settings) => {
		if (typeof canvasAssignmentGroups === "undefined") {
			console.log("cannot apply groups if no groups loaded");
			return;
		}
		const localAssignmentGroups = settings.assignmentGroups;
		const localNames = localAssignmentGroups.map((g) => g.name);
		const groupsToDelete = canvasAssignmentGroups.filter((c) => !localNames.includes(c.name));
		await Promise.all(groupsToDelete.map(async (g) => await canvasAssignmentGroupService.delete(canvasId, g.id, g.name)));
		const updatedGroups = await Promise.all(localAssignmentGroups.map(async (group) => {
			const canvasGroup = canvasAssignmentGroups.find((c) => c.name === group.name);
			if (!canvasGroup) {
				const newGroup = await canvasAssignmentGroupService.create(canvasId, group);
				return {
					...group,
					canvasId: newGroup.canvasId
				};
			} else {
				const groupWithCanvasId = {
					...group,
					canvasId: canvasGroup.id
				};
				if (canvasGroup.group_weight !== group.weight) await canvasAssignmentGroupService.update(canvasId, groupWithCanvasId);
				return groupWithCanvasId;
			}
		}));
		const updatedSettings = {
			...settings,
			assignmentGroups: updatedGroups
		};
		await updateSettingsMutation.mutateAsync({ settings: updatedSettings });
		return updatedSettings;
	} });
};
var useAssignmentGroupsQuery = (canvasId) => {
	return useQuery({
		queryKey: canvasCourseKeys.assignmentGroups(canvasId),
		queryFn: async () => await canvasAssignmentGroupService.getAll(canvasId)
	});
};
var useCourseStudentsQuery = (canvasId) => useQuery({
	queryKey: canvasCourseKeys.students(canvasId),
	queryFn: async () => await canvasService.getEnrolledStudents(canvasId)
});
//#endregion
export { canvasService as a, useSetAssignmentGroupsMutation as i, useCourseListInTermQuery as n, SelectInput as o, useCourseStudentsQuery as r, canvasCourseKeys as t };
