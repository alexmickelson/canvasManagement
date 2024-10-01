export enum AssignmentSubmissionType {
  ONLINE_TEXT_ENTRY = "online_text_entry",
  ONLINE_UPLOAD = "online_upload",
  ONLINE_QUIZ = "online_quiz",
  DISCUSSION_TOPIC = "discussion_topic",
  ONLINE_URL = "online_url",
  NONE = "none",
}

export const AssignmentSubmissionTypeList: AssignmentSubmissionType[] = [
  AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
  AssignmentSubmissionType.ONLINE_UPLOAD,
  AssignmentSubmissionType.ONLINE_QUIZ,
  AssignmentSubmissionType.DISCUSSION_TOPIC,
  AssignmentSubmissionType.ONLINE_URL,
  AssignmentSubmissionType.NONE,
] as const;
