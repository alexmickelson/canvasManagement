using CanvasModel.Users;

namespace CanvasModel.Enrollments;
public record EnrollmentModel
(

  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("course_id")]
  ulong CourseId,

  [property: JsonPropertyName("enrollment_state")]
  string EnrollmentState,

  [property: JsonPropertyName("type")]
  string Type,

  [property: JsonPropertyName("user_id")]
  ulong UserId,

  [property: JsonPropertyName("role")]
  string Role,

  [property: JsonPropertyName("role_id")]
  ulong RoleId,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("grades")]
  GradeModel Grades,

  [property: JsonPropertyName("user")]
  UserDisplayModel User,

  [property: JsonPropertyName("override_grade")]
  string OverrideGrade,

  [property: JsonPropertyName("sis_course_id")]
  string? SisCourseId = null,

  [property: JsonPropertyName("course_integration_id")]
  string? CourseIntegrationId = null,

  [property: JsonPropertyName("course_section_id")]
  ulong? CourseSectionId = null,

  [property: JsonPropertyName("section_integration_id")]
  string? SectionIntegrationId = null,

  [property: JsonPropertyName("sis_account_id")]
  string? SisAccountId = null,

  [property: JsonPropertyName("sis_section_id")]
  string? SisSectionId = null,

  [property: JsonPropertyName("sis_user_id")]
  string? SisUserId = null,

  [property: JsonPropertyName("limit_privileges_to_course_section")]
  bool? LimitPrivilegesToCourseSection = null,

  [property: JsonPropertyName("sis_import_id")]
  ulong? SisImportId = null,

  [property: JsonPropertyName("root_account_id")]
  ulong? RootAccountId = null,

  [property: JsonPropertyName("associated_user_id")]
  ulong? AssociatedUserId = null,

  [property: JsonPropertyName("created_at")]
  DateTime? CreatedAt = null,

  [property: JsonPropertyName("updated_at")]
  DateTime? UpdatedAt = null,

  [property: JsonPropertyName("start_at")]
  DateTime? StartAt = null,

  [property: JsonPropertyName("end_at")]
  DateTime? EndAt = null,

  [property: JsonPropertyName("last_activity_at")]
  DateTime? LastActivityAt = null,

  [property: JsonPropertyName("last_attended_at")]
  DateTime? LastAttendedAt = null,

  [property: JsonPropertyName("total_activity_time")]
  ulong? TotalActivityTime = null,

  [property: JsonPropertyName("override_score")]
  decimal? OverrideScore = null,

  [property: JsonPropertyName("unposted_current_grade")]
  string? UnpostedCurrentGrade = null,

  [property: JsonPropertyName("unposted_final_grade")]
  string? UnpostedFinalGrade = null,

  [property: JsonPropertyName("unposted_current_score")]
  string? UnpostedCurrentScore = null,

  [property: JsonPropertyName("unposted_final_score")]
  string? UnpostedFinalScore = null,

  [property: JsonPropertyName("has_grading_periods")]
  bool? HasGradingPeriods = null,

  [property: JsonPropertyName("totals_for_all_grading_periods_option")]
  bool? TotalsForAllGradingPeriodsOption = null,

  [property: JsonPropertyName("current_grading_period_title")]
  string? CurrentGradingPeriodTitle = null,

  [property: JsonPropertyName("current_grading_period_id")]
  ulong? CurrentGradingPeriodId = null,

  [property: JsonPropertyName("current_period_override_grade")]
  string? CurrentPeriodOverrideGrade = null,

  [property: JsonPropertyName("current_period_override_score")]
  decimal? CurrentPeriodOverrideScore = null,

  [property: JsonPropertyName("current_period_unposted_final_score")]
  decimal? CurrentPeriodUnpostedFinalScore = null,

  [property: JsonPropertyName("current_period_unposted_current_grade")]
  string? CurrentPeriodUnpostedCurrentGrade = null,

  [property: JsonPropertyName("current_period_unposted_final_grade")]
  string? CurrentPeriodUnpostedFinalGrade = null
);
