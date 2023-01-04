using System;
using System.Collections.Generic;


using Model.Enrollments;

namespace Model.Courses {
    
    public class CourseModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("sis_course_id")]
        public string SisCourseId { get; set; }
        
        [JsonPropertyName("uuid")]
        public string Uuid { get; set; }
        
        [JsonPropertyName("integration_id")]
        public string IntegrationId { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public ulong? SisImportId { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("course_code")]
        public string CourseCode { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
        
        [JsonPropertyName("account_id")]
        public ulong AccountId { get; set; }
        
        [JsonPropertyName("root_account_id")]
        public ulong RootAccountId { get; set; }
        
        [JsonPropertyName("enrollment_term_id")]
        public ulong EnrollmentTermId { get; set; }
        
        [JsonPropertyName("grading_standard_id")]
        public ulong? GradingStandardId { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("start_at")]
        public DateTime? StartAt { get; set; }
        
        [JsonPropertyName("end_at")]
        public DateTime? EndAt { get; set; }
        
        [JsonPropertyName("locale")]
        public string Locale { get; set; }
        
        [JsonPropertyName("enrollments")]
        public IEnumerable<EnrollmentModel>? Enrollments { get; set; }
        
        [JsonPropertyName("total_students")]
        public ulong? TotalStudents { get; set; }
        
        [JsonPropertyName("calendar")]
        public CalendarLinkModel Calendar { get; set; }
        
        [JsonPropertyName("default_view")]
        public string DefaultView { get; set; }
        
        [JsonPropertyName("syllabus_body")]
        public string SyllabusBody { get; set; }
        
        [JsonPropertyName("needs_grading_count")]
        public uint? NeedsGradingCount { get; set; }
        
        [JsonPropertyName("term")]
        public TermModel? Term { get; set; }
        
        [JsonPropertyName("course_progress")]
        public CourseProgressModel? CourseProgress { get; set; }
        
        [JsonPropertyName("apply_assignment_group_weights")]
        public bool? ApplyAssignmentGroupWeights { get; set; }
        
        [JsonPropertyName("permissions")]
        public Dictionary<string, bool> Permissions { get; set; }
        
        [JsonPropertyName("is_public")]
        public bool? IsPublic { get; set; }
        
        [JsonPropertyName("is_public_to_auth_users")]
        public bool? IsPublicToAuthUsers { get; set; }
        
        [JsonPropertyName("public_syllabus")]
        public bool? PublicSyllabus { get; set; }
        
        [JsonPropertyName("public_syllabus_to_auth")]
        public bool? PublicSyllabusToAuth { get; set; }
        
        [JsonPropertyName("public_description")]
        public string? PublicDescription { get; set; }
        
        [JsonPropertyName("storage_quota_mb")]
        public ulong StorageQuotaMb { get; set; }
        
        [JsonPropertyName("storage_quota_used_mb")]
        public ulong StorageQuotaUsedMb { get; set; }
        
        [JsonPropertyName("hide_final_grades")]
        public bool? HideFinalGrades { get; set; }
        
        [JsonPropertyName("license")]
        public string License { get; set; }
        
        [JsonPropertyName("allow_student_assignment_edits")]
        public bool? AllowStudentAssignmentEdits { get; set; }
        
        [JsonPropertyName("allow_wiki_comments")]
        public bool? AllowWikiComments { get; set; }
        
        [JsonPropertyName("allow_student_forum_attachments")]
        public bool? AllowStudentForumAttachments { get; set; }
        
        [JsonPropertyName("open_enrollment")]
        public bool? OpenEnrollment { get; set; }
        
        [JsonPropertyName("self_enrollment")]
        public bool? SelfEnrollment { get; set; }
        
        [JsonPropertyName("restrict_enrollments_to_courses")]
        public bool? RestrictEnrollmentsToCourseDates { get; set; }
        
        [JsonPropertyName("course_format")]
        public string CourseFormat { get; set; }
        
        [JsonPropertyName("access_restricted_by_date")]
        public bool? AccessRestrictedByDate { get; set; }
        
        [JsonPropertyName("time_zone")]
        public string TimeZone { get; set; }
        
        [JsonPropertyName("blueprint")]
        public bool? Blueprint { get; set; }
        
        [JsonPropertyName("blueprint_restrictions")]
        public Dictionary<string, bool>? BlueprintRestrictions { get; set; }

        [JsonPropertyName("blueprint_restrictions_by_object_type")]
        public Dictionary<string, Dictionary<string, bool>>? BlueprintRestrictionsByObjectType { get; set; }
    }
}