import { z } from "zod";
//#region src/features/local/assignments/models/assignmentSubmissionType.ts
var AssignmentSubmissionType = /* @__PURE__ */ function(AssignmentSubmissionType) {
	AssignmentSubmissionType["ONLINE_TEXT_ENTRY"] = "online_text_entry";
	AssignmentSubmissionType["ONLINE_UPLOAD"] = "online_upload";
	AssignmentSubmissionType["ONLINE_QUIZ"] = "online_quiz";
	AssignmentSubmissionType["DISCUSSION_TOPIC"] = "discussion_topic";
	AssignmentSubmissionType["ONLINE_URL"] = "online_url";
	AssignmentSubmissionType["NONE"] = "none";
	return AssignmentSubmissionType;
}({});
var zodAssignmentSubmissionType = z.enum([
	AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
	AssignmentSubmissionType.ONLINE_UPLOAD,
	AssignmentSubmissionType.ONLINE_QUIZ,
	AssignmentSubmissionType.DISCUSSION_TOPIC,
	AssignmentSubmissionType.ONLINE_URL,
	AssignmentSubmissionType.NONE
]);
var AssignmentSubmissionTypeList = [
	AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
	AssignmentSubmissionType.ONLINE_UPLOAD,
	AssignmentSubmissionType.ONLINE_QUIZ,
	AssignmentSubmissionType.DISCUSSION_TOPIC,
	AssignmentSubmissionType.ONLINE_URL,
	AssignmentSubmissionType.NONE
];
//#endregion
export { AssignmentSubmissionTypeList as n, zodAssignmentSubmissionType as r, AssignmentSubmissionType as t };
