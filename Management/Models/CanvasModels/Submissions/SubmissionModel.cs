using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.Users;

namespace CanvasModel.Submissions;
public record SubmissionModel
(
  [property: JsonPropertyName("assignment_id")]
  ulong AssignmentId,

  [property: JsonPropertyName("grade")]
  string Grade,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("preview_url")]
  string PreviewUrl,

  [property: JsonPropertyName("submission_type")]
  string SubmissionType,

  [property: JsonPropertyName("user_id")]
  ulong UserId,

  [property: JsonPropertyName("user")]
  UserModel User,

  [property: JsonPropertyName("workflow_state")]
  string WorkflowState,

  [property: JsonPropertyName("late_policy_status")]
  string LatePolicyStatus,

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

  [property: JsonPropertyName("grader_id")]
  long? GraderId = null,

  [property: JsonPropertyName("graded_at")]
  DateTime? GradedAt = null,

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
  string? AnonymousId = null
);
