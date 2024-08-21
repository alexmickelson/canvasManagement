import { CanvasModuleItem } from "./canvasModuleItems";

export interface CanvasModule {
  id: number;
  workflow_state: string;
  position: number;
  name: string;
  unlock_at?: string; // ISO 8601 date string
  require_sequential_progress?: boolean;
  prerequisite_module_ids?: number[];
  items_count: number;
  items_url: string;
  items?: CanvasModuleItem[];
  state?: string;
  completed_at?: string; // ISO 8601 date string
  publish_final_grade?: boolean;
  published?: boolean;
}
