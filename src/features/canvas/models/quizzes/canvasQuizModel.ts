import { CanvasLockInfo } from "../assignments/canvasLockInfo";
import { CanvasQuizPermissions } from "./canvasQuizPermission";

export interface CanvasQuiz {
  id: number;
  title: string;
  html_url: string;
  mobile_url: string;
  preview_url?: string;
  description: string;
  quiz_type: string;
  assignment_group_id?: number;
  time_limit?: number;
  shuffle_answers?: boolean;
  hide_results?: string;
  show_correct_answers?: boolean;
  show_correct_answers_last_attempt?: boolean;
  show_correct_answers_at?: string; // ISO 8601 date string
  hide_correct_answers_at?: string; // ISO 8601 date string
  one_time_results?: boolean;
  scoring_policy?: string;
  allowed_attempts: number;
  one_question_at_a_time?: boolean;
  question_count?: number;
  points_possible?: number;
  cant_go_back?: boolean;
  access_code?: string;
  ip_filter?: string;
  due_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
  unlock_at?: string; // ISO 8601 date string
  published?: boolean;
  unpublishable?: boolean;
  locked_for_user?: boolean;
  lock_info?: CanvasLockInfo;
  lock_explanation?: string;
  speedgrader_url?: string;
  quiz_extensions_url?: string;
  permissions: CanvasQuizPermissions;
  all_dates?: unknown; // Depending on the structure of the dates, this could be further specified
  version_number?: number;
  question_types?: string[];
  anonymous_submissions?: boolean;
}
