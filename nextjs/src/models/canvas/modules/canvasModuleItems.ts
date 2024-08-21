export interface CanvasModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent?: number;
  type: string;
  content_id?: number;
  html_url: string;
  url?: string;
  page_url?: string;
  external_url?: string;
  new_tab: boolean;
  completion_requirement?: {
    type: string;
    min_score?: number;
    completed?: boolean;
  };
  published?: boolean;
  content_details?: CanvasModuleItemContentDetails;
}

export interface CanvasModuleItemContentDetails {
  due_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
  points_possible: number;
  locked_for_user: boolean;
}
