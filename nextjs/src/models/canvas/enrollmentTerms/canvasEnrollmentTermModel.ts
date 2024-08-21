export interface CanvasEnrollmentTermModel {
  id: number;
  name: string;
  sis_term_id?: string;
  sis_import_id?: number;
  start_at?: string; // ISO 8601 date string
  end_at?: string; // ISO 8601 date string
  grading_period_group_id?: number;
  workflow_state?: string;
  overrides?: {
    [key: string]: {
      start_at?: string; // ISO 8601 date string
      end_at?: string; // ISO 8601 date string
    };
  };
}
