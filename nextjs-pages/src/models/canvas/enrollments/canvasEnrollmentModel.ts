import { CanvasUserDisplayModel } from "../users/userDisplayModel";
import { CanvasGradeModel } from "./canvasGradeModel";

export interface CanvasEnrollmentModel {
  id: number;
  course_id: number;
  enrollment_state: string;
  type: string;
  user_id: number;
  role: string;
  role_id: number;
  html_url: string;
  grades: CanvasGradeModel;
  user: CanvasUserDisplayModel;
  override_grade: string;
  sis_course_id?: string;
  course_integration_id?: string;
  course_section_id?: number;
  section_integration_id?: string;
  sis_account_id?: string;
  sis_section_id?: string;
  sis_user_id?: string;
  limit_privileges_to_course_section?: boolean;
  sis_import_id?: number;
  root_account_id?: number;
  associated_user_id?: number;
  created_at?: string; // ISO 8601 date string
  updated_at?: string; // ISO 8601 date string
  start_at?: string; // ISO 8601 date string
  end_at?: string; // ISO 8601 date string
  last_activity_at?: string; // ISO 8601 date string
  last_attended_at?: string; // ISO 8601 date string
  total_activity_time?: number;
  override_score?: number;
  unposted_current_grade?: string;
  unposted_final_grade?: string;
  unposted_current_score?: string;
  unposted_final_score?: string;
  has_grading_periods?: boolean;
  totals_for_all_grading_periods_option?: boolean;
  current_grading_period_title?: string;
  current_grading_period_id?: number;
  current_period_override_grade?: string;
  current_period_override_score?: number;
  current_period_unposted_final_score?: number;
  current_period_unposted_current_grade?: string;
  current_period_unposted_final_grade?: string;
}
