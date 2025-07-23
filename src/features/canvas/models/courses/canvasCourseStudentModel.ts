export interface CanvasCourseStudentModel {
  id: number;
  name: string;
  created_at: string; // ISO 8601 date string
  sortable_name: string;
  short_name: string;
  sis_user_id: string;
  integration_id?: string;
  root_account: string;
  login_id: string;
  email: string;
}