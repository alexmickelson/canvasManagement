import { CanvasAssignment } from "../assignments/canvasAssignment";
import { CanvasCourseModel } from "../courses/canvasCourseModel";
import { CanvasUserModel } from "../users/canvasUserModel";
import { CanvasUserDisplayModel } from "../users/userDisplayModel";

export interface CanvasSubmissionModel {
  assignment_id: number;
  grade: string;
  html_url: string;
  preview_url: string;
  submission_type: string;
  user_id: number;
  user: CanvasUserModel;
  workflow_state: string;
  late_policy_status: string;
  assignment?: CanvasAssignment;
  course?: CanvasCourseModel;
  attempt?: number;
  body?: string;
  grade_matches_current_submission?: boolean;
  score?: number;
  submission_comments?: {
    id: number;
    author_id: number;
    author_name: string;
    author: CanvasUserDisplayModel;
    comment: string;
    created_at: string; // ISO 8601 date string
    edited_at?: string; // ISO 8601 date string
    media_comment?: {
      content_type: string;
      display_name: string;
      media_id: string;
      media_type: string;
      url: string;
    };
  }[];
  submitted_at?: string; // ISO 8601 date string
  url?: string;
  grader_id?: number;
  graded_at?: string; // ISO 8601 date string
  late?: boolean;
  assignment_visible?: boolean;
  excused?: boolean;
  missing?: boolean;
  points_deducted?: number;
  seconds_late?: number;
  extra_attempts?: number;
  anonymous_id?: string;
}
