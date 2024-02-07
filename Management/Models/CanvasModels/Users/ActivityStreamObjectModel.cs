using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.Submissions;

namespace CanvasModel.Users;
public record ActivityStreamObjectModel
(
  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("title")]
  string Title,

  [property: JsonPropertyName("message")]
  string Message,

  [property: JsonPropertyName("type")]
  string Type,

  [property: JsonPropertyName("read_state")]
  bool ReadState,

  [property: JsonPropertyName("context_type")]
  string ContextType,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("notification_category")]
  string NotificationCategory,

  [property: JsonPropertyName("grade")]
  string Grade,

  [property: JsonPropertyName("preview_url")]
  string PreviewUrl,

  [property: JsonPropertyName("submission_type")]
  string SubmissionType,

  [property: JsonPropertyName("late_policy_status")]
  string LatePolicyStatus,

  [property: JsonPropertyName("workflow_state")]
  string WorkflowState,

  [property: JsonPropertyName("updated_at")]
  DateTime? UpdatedAt = null,

  [property: JsonPropertyName("course_id")]
  ulong? CourseId = null,

  [property: JsonPropertyName("group_id")]
  ulong? GroupId = null,

  [property: JsonPropertyName("total_root_discussion_entries")]
  uint? TotalRootDiscussionEntries = null,

  [property: JsonPropertyName("require_initial_post")]
  bool? RequireInitialPost = null,

  [property: JsonPropertyName("user_has_posted")]
  bool? UserHasPosted = null,

  [property: JsonPropertyName("root_discussion_entries")]
  object? RootDiscussionEntries = null,

  [property: JsonPropertyName("discussion_topic_id")]
  ulong? DiscussionTopicId = null,

  [property: JsonPropertyName("announcement_id")]
  ulong? AnnouncementId = null,

  [property: JsonPropertyName("conversation_id")]
  ulong? ConversationId = null,

  [property: JsonPropertyName("private")]
  bool? Private = null,

  [property: JsonPropertyName("participant_count")]
  uint? ParticipantCount = null,

  [property: JsonPropertyName("message_id")]
  ulong? MessageId = null,

  [property: JsonPropertyName("assignment_id")]
  ulong? AssignmentId = null,

  [property: JsonPropertyName("assignment")]
  CanvasAssignment? Assignment = null,

  [property: JsonPropertyName("course")]
  CourseModel? Course = null,

  [property: JsonPropertyName("attempt")]
  uint? Attempt = null,

  [property: JsonPropertyName("body")]
  string? Body = null,

  [property: JsonPropertyName("grade_matches_current_submission")]
  bool? GradeMatchesCurrentSubmission = null,

  [property: JsonPropertyName("score")]
  decimal? Score = null,

  [property: JsonPropertyName("submission_comments")]
  IEnumerable<SubmissionCommentModel>? SubmissionComments = null,

  [property: JsonPropertyName("submitted_at")]
  DateTime? SubmittedAt = null,

  [property: JsonPropertyName("url")]
  string? Url = null,

  [property: JsonPropertyName("user_id")]
  ulong? UserId = null,

  [property: JsonPropertyName("grader_id")]
  long? GraderId = null,

  [property: JsonPropertyName("graded_at")]
  DateTime? GradedAt = null,

  [property: JsonPropertyName("user")]
  UserModel? User = null,

  [property: JsonPropertyName("late")]
  bool? Late = null,

  [property: JsonPropertyName("assignment_visible")]
  bool? AssignmentVisible = null,

  [property: JsonPropertyName("excused")]
  bool? Excused = null,

  [property: JsonPropertyName("missing")]
  bool? Missing = null,

  [property: JsonPropertyName("points_deducted")]
  double? PointsDeducted = null,

  [property: JsonPropertyName("seconds_late")]
  double? SecondsLate = null,

  [property: JsonPropertyName("extra_attempts")]
  uint? ExtraAttempts = null,

  [property: JsonPropertyName("anonymous_id")]
  string? AnonymousId = null,

  [property: JsonPropertyName("web_conference_id")]
  ulong? WebConferenceId = null,

  [property: JsonPropertyName("collaboration_id")]
  ulong? CollaborationId = null,

  [property: JsonPropertyName("assignment_request_id")]
  ulong? AssignmentRequestId = null
);
