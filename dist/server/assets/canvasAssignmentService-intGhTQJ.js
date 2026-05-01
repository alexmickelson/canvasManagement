import { n as getDateFromString } from "./timeUtils-DjiIXWRA.js";
import { a as paginatedRequest, i as canvasApi, n as rateLimitAwarePost, o as axiosClient } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { a as markdownToHTMLSafe } from "./BreadCrumbs-xctKec6Z.js";
//#region src/features/local/assignments/models/utils/assignmentPointsUtils.ts
var assignmentPoints = (rubric) => {
	return rubric.map((r) => {
		if (r.label.toLowerCase().includes("(extra credit)")) return 0;
		if (r.points < 0) return 0;
		return r.points;
	}).reduce((acc, current) => current > 0 ? acc + current : acc, 0);
};
//#endregion
//#region src/features/canvas/services/canvasRubricUtils.ts
var getRubricCriterion = (rubric) => {
	return rubric.map((rubricItem) => ({
		description: rubricItem.label,
		points: rubricItem.points,
		ratings: {
			0: {
				description: "Full Marks",
				points: rubricItem.points
			},
			1: {
				description: "No Marks",
				points: 0
			}
		}
	})).reduce((acc, item, index) => {
		return {
			...acc,
			[index]: item
		};
	}, {});
};
//#endregion
//#region src/features/canvas/services/canvasAssignmentService.ts
var canvasAssignmentService = {
	async getAll(courseId) {
		console.log("getting canvas assignments");
		return (await paginatedRequest({ url: `${canvasApi}/courses/${courseId}/assignments` })).map((a) => ({
			...a,
			due_at: a.due_at ? new Date(a.due_at).toLocaleString() : void 0,
			lock_at: a.lock_at ? new Date(a.lock_at).toLocaleString() : void 0
		}));
	},
	async create(canvasCourseId, localAssignment, settings, canvasAssignmentGroupId) {
		console.log(`Creating assignment: ${localAssignment.name}`);
		const url = `${canvasApi}/courses/${canvasCourseId}/assignments`;
		const content = markdownToHTMLSafe({
			markdownString: localAssignment.description,
			settings,
			replaceText: [{
				source: "insert_github_classroom_url",
				destination: localAssignment.githubClassroomAssignmentShareLink || "",
				strict: true
			}]
		});
		const canvasAssignment = (await rateLimitAwarePost(url, { assignment: {
			name: localAssignment.name,
			submission_types: localAssignment.submissionTypes.map((t) => t.toString()),
			allowed_extensions: localAssignment.allowedFileUploadExtensions.map((e) => e.toString()),
			description: content,
			due_at: getDateFromString(localAssignment.dueAt)?.toISOString(),
			lock_at: localAssignment.lockAt && getDateFromString(localAssignment.lockAt)?.toISOString(),
			points_possible: assignmentPoints(localAssignment.rubric),
			assignment_group_id: canvasAssignmentGroupId
		} })).data;
		await createRubric(canvasCourseId, canvasAssignment.id, localAssignment);
		return canvasAssignment.id;
	},
	async update(courseId, canvasAssignmentId, localAssignment, settings, canvasAssignmentGroupId) {
		console.log(`Updating assignment: ${localAssignment.name}`);
		const url = `${canvasApi}/courses/${courseId}/assignments/${canvasAssignmentId}`;
		const body = { assignment: {
			name: localAssignment.name,
			submission_types: localAssignment.submissionTypes.map((t) => t.toString()),
			allowed_extensions: localAssignment.allowedFileUploadExtensions.map((e) => e.toString()),
			description: markdownToHTMLSafe({
				markdownString: localAssignment.description,
				settings,
				replaceText: [{
					source: "insert_github_classroom_url",
					destination: localAssignment.githubClassroomAssignmentShareLink || "",
					strict: true
				}]
			}),
			due_at: getDateFromString(localAssignment.dueAt)?.toISOString(),
			lock_at: localAssignment.lockAt && getDateFromString(localAssignment.lockAt)?.toISOString(),
			points_possible: assignmentPoints(localAssignment.rubric),
			assignment_group_id: canvasAssignmentGroupId
		} };
		await axiosClient.put(url, body);
		await createRubric(courseId, canvasAssignmentId, localAssignment);
	},
	async delete(courseId, assignmentCanvasId, assignmentName) {
		console.log(`Deleting assignment from Canvas: ${assignmentName}`);
		const url = `${canvasApi}/courses/${courseId}/assignments/${assignmentCanvasId}`;
		if (!(await axiosClient.delete(url)).status.toString().startsWith("2")) {
			console.error(`Failed to delete assignment: ${assignmentName}`);
			throw new Error("Failed to delete assignment");
		}
	}
};
var createRubric = async (courseId, assignmentCanvasId, localAssignment) => {
	const criterion = getRubricCriterion(localAssignment.rubric);
	const rubricBody = {
		rubric_association_id: assignmentCanvasId,
		rubric: {
			title: `Rubric for Assignment: ${localAssignment.name}`,
			association_id: assignmentCanvasId,
			association_type: "Assignment",
			use_for_grading: true,
			criteria: criterion
		},
		rubric_association: {
			association_id: assignmentCanvasId,
			association_type: "Assignment",
			purpose: "grading",
			use_for_grading: true
		}
	};
	if (!(await rateLimitAwarePost(`https://snow.instructure.com/api/v1/courses/${courseId}/rubrics`, rubricBody)).data) throw new Error("Failed to create rubric");
	const assignmentPointAdjustmentUrl = `${canvasApi}/courses/${courseId}/assignments/${assignmentCanvasId}`;
	const assignmentPointAdjustmentBody = { assignment: { points_possible: assignmentPoints(localAssignment.rubric) } };
	await axiosClient.put(assignmentPointAdjustmentUrl, assignmentPointAdjustmentBody);
};
//#endregion
export { assignmentPoints as n, canvasAssignmentService as t };
