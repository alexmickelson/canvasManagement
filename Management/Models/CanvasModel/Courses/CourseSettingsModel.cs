

namespace Model.Courses {
    
    public class CourseSettingsModel {
        
        [JsonPropertyName("allow_final_grade_override")]
        public bool AllowFinalGradeOverride { get; set; }
        
        [JsonPropertyName("allow_student_discussion_topics")]
        public bool AllowStudentDiscussionTopics { get; set; }
        
        [JsonPropertyName("allow_student_forum_attachments")]
        public bool AllowStudentForumAttachments { get; set; }
        
        [JsonPropertyName("allow_student_discussion_editing")]
        public bool AllowStudentDiscussionEditing { get; set; }
        
        [JsonPropertyName("grading_standard_enabled")]
        public bool GradingStandardEnabled { get; set; }
        
        [JsonPropertyName("grading_standard_id")]
        public ulong? GradingStandardId { get; set; }
        
        [JsonPropertyName("allow_student_organized_groups")]
        public bool AllowStudentOrganizedGroups { get; set; }
        
        [JsonPropertyName("hide_final_groups")]
        public bool HideFinalGrades { get; set; }
        
        [JsonPropertyName("hide_distributor_graphs")]
        public bool HideDistributionGraphs { get; set; }
        
        [JsonPropertyName("lock_all_announcements")]
        public bool LockAllAnnouncements { get; set; }
        
        [JsonPropertyName("restrict_student_past_view")]
        public bool RestrictStudentPastView { get; set; }
        
        [JsonPropertyName("restrict_student_future_view")]
        public bool RestrictStudentFutureView { get; set; }
        
        [JsonPropertyName("show_announcements_on_home_page")]
        public bool ShowAnnouncementsOnHomePage { get; set; }
        
        [JsonPropertyName("home_page_announcements_limit")]
        public long HomePageAnnouncementLimit { get; set; }
    }
}
