export interface CourseProgressModel {
  requirement_count?: number;
  requirement_completed_count?: number;
  next_requirement_url?: string;
  completed_at?: string; // ISO 8601 date string
}
