using CanvasModel.Enrollments;

namespace CanvasModel.Courses;

public record CourseModel(
  [property: JsonPropertyName("id")] ulong Id,
  [property: JsonPropertyName("sis_course_id")] string SisCourseId,
  [property: JsonPropertyName("uuid")] string Uuid,
  [property: JsonPropertyName("integration_id")] string IntegrationId,
  [property: JsonPropertyName("name")] string Name,
  [property: JsonPropertyName("course_code")] string CourseCode,
  [property: JsonPropertyName("workflow_state")] string WorkflowState,
  [property: JsonPropertyName("account_id")] ulong AccountId,
  [property: JsonPropertyName("root_account_id")] ulong RootAccountId,
  [property: JsonPropertyName("enrollment_term_id")] ulong EnrollmentTermId,
  [property: JsonPropertyName("created_at")] DateTime CreatedAt,
  [property: JsonPropertyName("locale")] string Locale,
  [property: JsonPropertyName("calendar")] CalendarLinkModel Calendar,
  [property: JsonPropertyName("default_view")] string DefaultView,
  [property: JsonPropertyName("syllabus_body")] string SyllabusBody,
  [property: JsonPropertyName("permissions")] Dictionary<string, bool> Permissions,
  [property: JsonPropertyName("storage_quota_mb")] ulong StorageQuotaMb,
  [property: JsonPropertyName("storage_quota_used_mb")] ulong StorageQuotaUsedMb,
  [property: JsonPropertyName("license")] string License,
  [property: JsonPropertyName("course_format")] string CourseFormat,
  [property: JsonPropertyName("time_zone")] string TimeZone,
  [property: JsonPropertyName("sis_import_id")] ulong? SisImportId = null,
  [property: JsonPropertyName("grading_standard_id")] ulong? GradingStandardId = null,
  [property: JsonPropertyName("start_at")] DateTime? StartAt = null,
  [property: JsonPropertyName("end_at")] DateTime? EndAt = null,
  [property: JsonPropertyName("enrollments")] IEnumerable<EnrollmentModel>? Enrollments = null,
  [property: JsonPropertyName("total_students")] ulong? TotalStudents = null,
  [property: JsonPropertyName("needs_grading_count")] uint? NeedsGradingCount = null,
  [property: JsonPropertyName("term")] TermModel? Term = null,
  [property: JsonPropertyName("course_progress")] CourseProgressModel? CourseProgress = null,
  [property: JsonPropertyName("apply_assignment_group_weights")]
    bool? ApplyAssignmentGroupWeights = null,
  [property: JsonPropertyName("is_public")] bool? Is = null,
  [property: JsonPropertyName("is_public_to_auth_users")] bool? IsPublicToAuthUsers = null,
  [property: JsonPropertyName("public_syllabus")] bool? PublicSyllabus = null,
  [property: JsonPropertyName("public_syllabus_to_auth")] bool? PublicSyllabusToAuth = null,
  [property: JsonPropertyName("public_description")] string? PublicDescription = null,
  [property: JsonPropertyName("hide_final_grades")] bool? HideFinalGrades = null,
  [property: JsonPropertyName("allow_student_assignment_edits")]
    bool? AllowStudentAssignmentEdits = null,
  [property: JsonPropertyName("allow_wiki_comments")] bool? AllowWikiComments = null,
  [property: JsonPropertyName("allow_student_forum_attachments")]
    bool? AllowStudentForumAttachments = null,
  [property: JsonPropertyName("open_enrollment")] bool? OpenEnrollment = null,
  [property: JsonPropertyName("self_enrollment")] bool? SelfEnrollment = null,
  [property: JsonPropertyName("restrict_enrollments_to_courses")]
    bool? RestrictEnrollmentsToCourseDates = null,
  [property: JsonPropertyName("access_restricted_by_date")] bool? AccessRestrictedByDate = null,
  [property: JsonPropertyName("blueprint")] bool? Blueprint = null,
  [property: JsonPropertyName("blueprint_restrictions")]
    Dictionary<string, bool>? BlueprintRestrictions = null,
  [property: JsonPropertyName("blueprint_restrictions_by_object_type")]
    Dictionary<string, Dictionary<string, bool>>? BlueprintRestrictionsByObjectType = null
);
