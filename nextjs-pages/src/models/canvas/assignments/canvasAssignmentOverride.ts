export interface CanvasAssignmentOverride {
  id: number;
  assignment_id: number;
  course_section_id: number;
  title: string;
  student_ids?: number[];
  group_id?: number;
  due_at?: string; // ISO 8601 date string
  all_day?: boolean;
  all_day_date?: string; // ISO 8601 date string
  unlock_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
}
