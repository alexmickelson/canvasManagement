using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.Users;

namespace CanvasModel.Submissions;
public class SubmissionModel
{

  [JsonPropertyName("assignment_id")]
  public ulong AssignmentId { get; set; }

  [JsonPropertyName("assignment")]
  public AssignmentModel? Assignment { get; set; }

  [JsonPropertyName("course")]
  public CourseModel? Course { get; set; }

  [JsonPropertyName("attempt")]
  public uint? Attempt { get; set; }

  [JsonPropertyName("body")]
  public string? Body { get; set; }

  [JsonPropertyName("grade")]
  public string Grade { get; set; }

  [JsonPropertyName("grade_matches_current_submission")]
  public bool? GradeMatchesCurrentSubmission { get; set; }

  [JsonPropertyName("html_url")]
  public string HtmlUrl { get; set; }

  [JsonPropertyName("preview_url")]
  public string PreviewUrl { get; set; }

  [JsonPropertyName("score")]
  public decimal? Score { get; set; }

  [JsonPropertyName("submission_comments")]
  public IEnumerable<SubmissionCommentModel>? SubmissionComments { get; set; }

  [JsonPropertyName("submission_type")]
  public string SubmissionType { get; set; }

  [JsonPropertyName("submitted_at")]
  public DateTime? SubmittedAt { get; set; }

  [JsonPropertyName("url")]
  public string? Url { get; set; }

  [JsonPropertyName("user_id")]
  public ulong UserId { get; set; }

  [JsonPropertyName("grader_id")]
  public long? GraderId { get; set; } // why can this be negative???

  [JsonPropertyName("graded_at")]
  public DateTime? GradedAt { get; set; }

  [JsonPropertyName("user")]
  public UserModel User { get; set; }

  [JsonPropertyName("late")]
  public bool? Late { get; set; }

  [JsonPropertyName("assignment_visible")]
  public bool? AssignmentVisible { get; set; }

  [JsonPropertyName("excused")]
  public bool? Excused { get; set; }

  [JsonPropertyName("missing")]
  public bool? Missing { get; set; }

  [JsonPropertyName("late_policy_status")]
  public string LatePolicyStatus { get; set; }

  [JsonPropertyName("points_deducted")]
  public double? PointsDeducted { get; set; }

  [JsonPropertyName("seconds_late")]
  public double? SecondsLate { get; set; }

  [JsonPropertyName("workflow_state")]
  public string WorkflowState { get; set; }

  [JsonPropertyName("extra_attempts")]
  public uint? ExtraAttempts { get; set; }

  [JsonPropertyName("anonymous_id")]
  public string? AnonymousId { get; set; }
}