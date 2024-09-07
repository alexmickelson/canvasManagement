export interface CanvasPage {
  page_id: number;
  url: string;
  title: string;
  published: boolean;
  front_page: boolean;
  body?: string;
  // Uncomment and define if needed
  // created_at: string; // ISO 8601 date string
  // updated_at: string; // ISO 8601 date string
  // editing_roles: string;
  // last_edited_by: UserDisplayModel;
  // locked_for_user: boolean;
  // lock_info?: LockInfoModel;
  // lock_explanation?: string;
}
