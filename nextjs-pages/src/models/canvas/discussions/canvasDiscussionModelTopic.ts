import { CanvasUserDisplayModel } from "../users/userDisplayModel";
import { CanvasFileAttachmentModel } from "./canvasFileAttachmentModel";

export interface CanvasDiscussionTopicModel {
  id: number;
  title: string;
  message: string;
  html_url: string;
  read_state: string;
  subscription_hold: string;
  assignment_id: number;
  lock_explanation: string;
  user_name: string;
  topic_children: number[];
  podcast_url: string;
  discussion_type: string;
  attachments: CanvasFileAttachmentModel[];
  permissions: { [key: string]: boolean };
  author: CanvasUserDisplayModel;
  unread_count?: number;
  subscribed?: boolean;
  posted_at?: string; // ISO 8601 date string
  last_reply_at?: string; // ISO 8601 date string
  require_initial_post?: boolean;
  user_can_see_posts?: boolean;
  discussion_subentry_count?: number;
  delayed_post_at?: string; // ISO 8601 date string
  published?: boolean;
  lock_at?: string; // ISO 8601 date string
  locked?: boolean;
  pinned?: boolean;
  locked_for_user?: boolean;
  lock_info?: any;
  group_topic_children?: any;
  root_topic_id?: number;
  group_category_id?: number;
  allow_rating?: boolean;
  only_graders_can_rate?: boolean;
  sort_by_rating?: boolean;
}
