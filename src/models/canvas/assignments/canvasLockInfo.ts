export interface CanvasLockInfo {
  asset_string: string;
  unlock_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
  context_module?: any;
  manually_locked?: boolean;
}
