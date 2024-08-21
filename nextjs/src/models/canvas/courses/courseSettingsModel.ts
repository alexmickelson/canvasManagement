export interface CourseSettingsModel {
  allow_final_grade_override: boolean;
  allow_student_discussion_topics: boolean;
  allow_student_forum_attachments: boolean;
  allow_student_discussion_editing: boolean;
  grading_standard_enabled: boolean;
  allow_student_organized_groups: boolean;
  hide_final_grades: boolean;
  hide_distribution_graphs: boolean;
  lock_all_announcements: boolean;
  restrict_student_past_view: boolean;
  restrict_student_future_view: boolean;
  show_announcements_on_home_page: boolean;
  home_page_announcement_limit: number;
  grading_standard_id?: number;
}
