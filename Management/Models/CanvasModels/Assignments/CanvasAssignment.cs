using CanvasModel.Discussions;
using CanvasModel.Submissions;

namespace CanvasModel.Assignments;

public record CanvasAssignment
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("name")]
  string Name,

  [property: JsonPropertyName("description")]
  string Description,

  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("has_overrides")]
  bool HasOverrides,

  [property: JsonPropertyName("course_id")]
  ulong CourseId,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("submissions_download_url")]
  string SubmissionsDownloadUrl,

  [property: JsonPropertyName("assignment_group_id")]
  ulong AssignmentGroupId,

  [property: JsonPropertyName("due_date_required")]
  bool DueDateRequired,

  [property: JsonPropertyName("max_name_length")]
  uint MaxNameLength,

  [property: JsonPropertyName("peer_reviews")]
  bool PeerReviews,

  [property: JsonPropertyName("automatic_peer_reviews")]
  bool AutomaticPeerReviews,

  [property: JsonPropertyName("position")]
  ulong Position,

  [property: JsonPropertyName("grading_type")]
  string GradingType,

  [property: JsonPropertyName("published")]
  bool Published,

  [property: JsonPropertyName("unpublishable")]
  bool Unpublishable,

  [property: JsonPropertyName("only_visible_to_overrides")]
  bool OnlyVisibleToOverrides,

  [property: JsonPropertyName("locked_for_user")]
  bool LockedForUser,

  [property: JsonPropertyName("moderated_grading")]
  bool ModeratedGrading,

  [property: JsonPropertyName("grader_count")]
  uint GraderCount,

  [property: JsonPropertyName("allowed_attempts")]
  int AllowedAttempts,

  [property: JsonPropertyName("submission_types")]
  IEnumerable<string> SubmissionTypes,

  [property: JsonPropertyName("updated_at")]
  DateTime? UpdatedAt = null,

  [property: JsonPropertyName("due_at")]
  DateTime? DueAt = null,

  [property: JsonPropertyName("lock_at")]
  DateTime? LockAt = null,

  [property: JsonPropertyName("unlock_at")]
  DateTime? UnlockAt = null,

  [property: JsonPropertyName("all_dates")]
  IEnumerable<CanvasAssignmentDate>? AllDates = null,

  [property: JsonPropertyName("allowed_extensions")]
  IEnumerable<string>? AllowedExtensions = null,

  [property: JsonPropertyName("turnitin_enabled")]
  bool? TurnitinEnabled = null,

  [property: JsonPropertyName("vericite_enabled")]
  bool? VeriCiteEnabled = null,

  [property: JsonPropertyName("turnitin_settings")]
  CanvasTurnitinSettings? TurnitinSettings = null,

  [property: JsonPropertyName("grade_group_students_individually")]
  bool? GradeGroupStudentsIndividually = null,

  [property: JsonPropertyName("external_tool_tag_attributes")]
  CanvasExternalToolTagAttributes? ExternalToolTagAttributes = null,

  [property: JsonPropertyName("peer_review_count")]
  uint? PeerReviewCount = null,

  [property: JsonPropertyName("peer_reviews_assign_at")]
  DateTime? PeerReviewsAssignAt = null,

  [property: JsonPropertyName("intra_group_peer_reviews")]
  bool? IntraGroupPeerReviews = null,

  [property: JsonPropertyName("group_category_id")]
  ulong? GroupCategoryId = null,

  [property: JsonPropertyName("needs_grading_count")]
  uint? NeedsGradingCount = null,

  [property: JsonPropertyName("needs_grading_count_be_section")]
  IEnumerable<CanvasNeedsGradingCount>? NeedsGradingCountBySection = null,

  [property: JsonPropertyName("post_to_sis")]
  bool? PostToSis = null,

  [property: JsonPropertyName("integration_id")]
  string? IntegrationId = null,

  [property: JsonPropertyName("integration_data")]
  object? IntegrationData = null,

  [property: JsonPropertyName("muted")]
  bool? Muted = null,

  [property: JsonPropertyName("points_possible")]
  double? PointsPossible = null,

  [property: JsonPropertyName("has_submitted_submissions")]
  bool? HasSubmittedSubmissions = null,

  [property: JsonPropertyName("grading_standard_id")]
  ulong? GradingStandardId = null,

  [property: JsonPropertyName("lock_info")]
  CanvasLockInfo? LockInfo = null,

  [property: JsonPropertyName("lock_explanation")]
  string? LockExplanation = null,

  [property: JsonPropertyName("quiz_id")]
  ulong? QuizId = null,

  [property: JsonPropertyName("anonymous_submissions")]
  bool? AnonymousSubmissions = null,

  [property: JsonPropertyName("discussion_topic")]
  DiscussionTopicModel? DiscussionTopic = null,

  [property: JsonPropertyName("freeze_on_copy")]
  bool? FreezeOnCopy = null,

  [property: JsonPropertyName("frozen")]
  bool? Frozen = null,

  [property: JsonPropertyName("frozen_attributes")]
  IEnumerable<string>? FrozenAttributes = null,

  [property: JsonPropertyName("submission")]
  SubmissionModel? Submission = null,

  [property: JsonPropertyName("use_rubric_for_grading")]
  bool? UseRubricForGrading = null,

  [property: JsonPropertyName("rubric_settings")]
  object? RubricSettings = null,

  [property: JsonPropertyName("rubric")]
  IEnumerable<CanvasRubricCriteria>? Rubric = null,

  [property: JsonPropertyName("assignment_visibility")]
  IEnumerable<ulong>? AssignmentVisibility = null,

  [property: JsonPropertyName("overrides")]
  IEnumerable<CanvasAssignmentOverride>? Overrides = null,

  [property: JsonPropertyName("omit_from_final_grade")]
  bool? OmitFromFinalGrade = null,

  [property: JsonPropertyName("final_grader_id")]
  ulong? FinalGraderId = null,

  [property: JsonPropertyName("grader_comments_visible_to_graders")]
  bool? GraderCommentsVisibleToGraders = null,

  [property: JsonPropertyName("graders_anonymous_to_graders")]
  bool? GradersAnonymousToGraders = null,

  [property: JsonPropertyName("grader_names_anonymous_to_final_grader")]
  bool? GraderNamesVisibleToFinalGrader = null,

  [property: JsonPropertyName("anonymous_grading")]
  bool? AnonymousGrading = null
);