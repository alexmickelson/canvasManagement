import { DiscussionTopicModel } from "../discussions/canvasDiscussionModelTopic";
import { SubmissionModel } from "../submissions/canvasSubmissionModel";
import { CanvasAssignmentDate } from "./canvasAssignmentDate";
import { CanvasAssignmentOverride } from "./canvasAssignmentOverride";
import { CanvasExternalToolTagAttributes } from "./canvasExternalToolTagAttributes";
import { CanvasLockInfo } from "./CanvasLockInfo";
import { CanvasRubricCriteria } from "./canvasRubricCriteria";
import { CanvasTurnitinSettings } from "./canvasTurnitinSettings";

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  created_at: string; // ISO 8601 date string
  has_overrides: boolean;
  course_id: number;
  html_url: string;
  submissions_download_url: string;
  assignment_group_id: number;
  due_date_required: boolean;
  max_name_length: number;
  peer_reviews: boolean;
  automatic_peer_reviews: boolean;
  position: number;
  grading_type: string;
  published: boolean;
  unpublishable: boolean;
  only_visible_to_overrides: boolean;
  locked_for_user: boolean;
  moderated_grading: boolean;
  grader_count: number;
  allowed_attempts: number;
  is_quiz_assignment: boolean;
  submission_types: string[];
  updated_at?: string; // ISO 8601 date string
  due_at?: string; // ISO 8601 date string
  lock_at?: string; // ISO 8601 date string
  unlock_at?: string; // ISO 8601 date string
  all_dates?: CanvasAssignmentDate[];
  allowed_extensions?: string[];
  turnitin_enabled?: boolean;
  vericite_enabled?: boolean;
  turnitin_settings?: CanvasTurnitinSettings;
  grade_group_students_individually?: boolean;
  external_tool_tag_attributes?: CanvasExternalToolTagAttributes;
  peer_review_count?: number;
  peer_reviews_assign_at?: string; // ISO 8601 date string
  intra_group_peer_reviews?: boolean;
  group_category_id?: number;
  needs_grading_count?: number;
  needs_grading_count_by_section?: {
    section_id: string;
    needs_grading_count: number;
  }[];
  post_to_sis?: boolean;
  integration_id?: string;
  integration_data?: any;
  muted?: boolean;
  points_possible?: number;
  has_submitted_submissions?: boolean;
  grading_standard_id?: number;
  lock_info?: CanvasLockInfo;
  lock_explanation?: string;
  quiz_id?: number;
  anonymous_submissions?: boolean;
  discussion_topic?: DiscussionTopicModel;
  freeze_on_copy?: boolean;
  frozen?: boolean;
  frozen_attributes?: string[];
  submission?: SubmissionModel;
  use_rubric_for_grading?: boolean;
  rubric_settings?: any;
  rubric?: CanvasRubricCriteria[];
  assignment_visibility?: number[];
  overrides?: CanvasAssignmentOverride[];
  omit_from_final_grade?: boolean;
  final_grader_id?: number;
  grader_comments_visible_to_graders?: boolean;
  graders_anonymous_to_graders?: boolean;
  grader_names_visible_to_final_grader?: boolean;
  anonymous_grading?: boolean;
}
