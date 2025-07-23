export interface CanvasAssignmentDate {
  title: string;
  id?: number;
  base?: boolean;
  due_at?: string; // ISO 8601 date string
  unlock_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
}
