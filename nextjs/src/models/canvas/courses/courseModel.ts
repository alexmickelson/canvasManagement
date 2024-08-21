import { EnrollmentModel } from "../enrollments/enrollmentModel";
import { CalendarLinkModel } from "./calendarLinkModel";
import { CourseProgressModel } from "./courseProgressModel";
import { TermModel } from "./termModel";

export interface CourseModel {
  id: number;
  sis_course_id: string;
  uuid: string;
  integration_id: string;
  name: string;
  course_code: string;
  workflow_state: string;
  account_id: number;
  root_account_id: number;
  enrollment_term_id: number;
  created_at: string; // ISO 8601 date string
  locale: string;
  calendar: CalendarLinkModel;
  default_view: string;
  syllabus_body: string;
  permissions: { [key: string]: boolean };
  storage_quota_mb: number;
  storage_quota_used_mb: number;
  license: string;
  course_format: string;
  time_zone: string;
  sis_import_id?: number;
  grading_standard_id?: number;
  start_at?: string; // ISO 8601 date string
  end_at?: string; // ISO 8601 date string
  enrollments?: EnrollmentModel[];
  total_students?: number;
  needs_grading_count?: number;
  term?: TermModel;
  course_progress?: CourseProgressModel;
  apply_assignment_group_weights?: boolean;
  is_public?: boolean;
  is_public_to_auth_users?: boolean;
  public_syllabus?: boolean;
  public_syllabus_to_auth?: boolean;
  public_description?: string;
  hide_final_grades?: boolean;
  allow_student_assignment_edits?: boolean;
  allow_wiki_comments?: boolean;
  allow_student_forum_attachments?: boolean;
  open_enrollment?: boolean;
  self_enrollment?: boolean;
  restrict_enrollments_to_course_dates?: boolean;
  access_restricted_by_date?: boolean;
  blueprint?: boolean;
  blueprint_restrictions?: { [key: string]: boolean };
  blueprint_restrictions_by_object_type?: { [key: string]: { [key: string]: boolean } };
}
