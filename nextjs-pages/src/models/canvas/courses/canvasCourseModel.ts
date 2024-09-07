import { CanvasEnrollmentModel } from "../enrollments/canvasEnrollmentModel";
import { CanvasCalendarLinkModel } from "./canvasCalendarLinkModel";
import { CanvasCourseProgressModel } from "./canvasCourseProgressModel";
import { CanvasTermModel } from "./canvasTermModel";

export interface CanvasCourseModel {
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
  calendar: CanvasCalendarLinkModel;
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
  enrollments?: CanvasEnrollmentModel[];
  total_students?: number;
  needs_grading_count?: number;
  term?: CanvasTermModel;
  course_progress?: CanvasCourseProgressModel;
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
  blueprint_restrictions_by_object_type?: {
    [key: string]: { [key: string]: boolean };
  };
}
