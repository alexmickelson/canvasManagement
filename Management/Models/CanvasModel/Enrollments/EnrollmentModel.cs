using System;


using Model.Users;

namespace Model.Enrollments {
    
    public class EnrollmentModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("course_id")]
        public ulong CourseId { get; set; }
        
        [JsonPropertyName("sis_course_id")]
        public string? SisCourseId { get; set; }
        
        [JsonPropertyName("course_integration_id")]
        public string? CourseIntegrationId { get; set; }
        
        [JsonPropertyName("course_section_id")]
        public ulong? CourseSectionId { get; set; }
        
        [JsonPropertyName("section_integration_id")]
        public string? SectionIntegrationId { get; set; }
        
        [JsonPropertyName("sis_account_id")]
        public string? SisAccountId { get; set; }
        
        [JsonPropertyName("sis_section_id")]
        public string? SisSectionId { get; set; }
        
        [JsonPropertyName("sis_user_id")]
        public string? SisUserId { get; set; }
        
        [JsonPropertyName("enrollment_state")]
        public string EnrollmentState { get; set; }
        
        [JsonPropertyName("limit_privileges_to_course_section")]
        public bool? LimitPrivilegesToCourseSection { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public ulong? SisImportId { get; set; }
        
        [JsonPropertyName("root_account_id")]
        public ulong? RootAccountId { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("user_id")]
        public ulong UserId { get; set; }
        
        [JsonPropertyName("associated_user_id")]
        public ulong? AssociatedUserId { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
        
        [JsonPropertyName("role_id")]
        public ulong RoleId { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [JsonPropertyName("start_at")]
        public DateTime? StartAt { get; set; }
        
        [JsonPropertyName("end_at")]
        public DateTime? EndAt { get; set; }
        
        [JsonPropertyName("last_activity_at")]
        public DateTime? LastActivityAt { get; set; }
        
        [JsonPropertyName("last_attended_at")]
        public DateTime? LastAttendedAt { get; set; }
        
        [JsonPropertyName("total_activity_time")]
        public ulong? TotalActivityTime { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }
        
        [JsonPropertyName("grades")]
        public GradeModel Grades { get; set; }
        
        [JsonPropertyName("user")]
        public UserDisplayModel User { get; set; }
        
        [JsonPropertyName("override_grade")]
        public string OverrideGrade { get; set; }
        
        [JsonPropertyName("override_score")]
        public decimal? OverrideScore { get; set; }
        
        [JsonPropertyName("unposted_current_grade")]
        public string? UnpostedCurrentGrade { get; set; }
        
        [JsonPropertyName("unposted_final_grade")]
        public string? UnpostedFinalGrade { get; set; }
        
        [JsonPropertyName("unposted_current_score")]
        public string? UnpostedCurrentScore { get; set; }
        
        [JsonPropertyName("unposted_final_score")]
        public string? UnpostedFinalScore { get; set; }
        
        [JsonPropertyName("has_grading_periods")]
        public bool? HasGradingPeriods { get; set; }

        [JsonPropertyName("totals_for_all_grading_periods_option")]
        public bool? TotalsForAllGradingPeriodsOption { get; set; }
        
        [JsonPropertyName("current_grading_period_title")]
        public string? CurrentGradingPeriodTitle { get; set; }
        
        [JsonPropertyName("current_grading_period_id")]
        public ulong? CurrentGradingPeriodId { get; set; }
        
        [JsonPropertyName("current_period_override_grade")]
        public string? CurrentPeriodOverrideGrade { get; set; }
        
        [JsonPropertyName("current_period_override_score")]
        public decimal? CurrentPeriodOverrideScore { get; set; }
        
        [JsonPropertyName("current_period_unposted_final_score")]
        public decimal? CurrentPeriodUnpostedFinalScore { get; set; }
        
        [JsonPropertyName("current_period_unposted_current_grade")]
        public string? CurrentPeriodUnpostedCurrentGrade { get; set; }
        
        [JsonPropertyName("current_period_unposted_final_grade")]
        public string? CurrentPeriodUnpostedFinalGrade { get; set; }
    }
}