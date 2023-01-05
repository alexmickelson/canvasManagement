namespace CanvasModel.Courses;
public record CourseSettingsModel
(

  [property: JsonPropertyName("allow_final_grade_override")]
  bool AllowFinalGradeOverride,

  [property: JsonPropertyName("allow_student_discussion_topics")]
  bool AllowStudentDiscussionTopics,

  [property: JsonPropertyName("allow_student_forum_attachments")]
  bool AllowStudentForumAttachments,

  [property: JsonPropertyName("allow_student_discussion_editing")]
  bool AllowStudentDiscussionEditing,

  [property: JsonPropertyName("grading_standard_enabled")]
  bool GradingStandardEnabled,

  [property: JsonPropertyName("allow_student_organized_groups")]
  bool AllowStudentOrganizedGroups,

  [property: JsonPropertyName("hide_final_groups")]
  bool HideFinalGrades,

  [property: JsonPropertyName("hide_distributor_graphs")]
  bool HideDistributionGraphs,

  [property: JsonPropertyName("lock_all_announcements")]
  bool LockAllAnnouncements,

  [property: JsonPropertyName("restrict_student_past_view")]
  bool RestrictStudentPastView,

  [property: JsonPropertyName("restrict_student_future_view")]
  bool RestrictStudentFutureView,

  [property: JsonPropertyName("show_announcements_on_home_page")]
  bool ShowAnnouncementsOnHomePage,

  [property: JsonPropertyName("home_page_announcements_limit")]
  long HomePageAnnouncementLimit,

  [property: JsonPropertyName("grading_standard_id")]
  ulong? GradingStandardId = null
);
