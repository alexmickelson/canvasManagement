using CanvasModel.Users;

namespace CanvasModel.Discussions;

public record DiscussionTopicModel
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("title")]
  string Title,

  [property: JsonPropertyName("message")]
  string Message,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("read_state")]
  string ReadState,

  [property: JsonPropertyName("subscription_hold")]
  string SubscriptionHold,

  [property: JsonPropertyName("assignment_id")]
  int AssignmentId,

  [property: JsonPropertyName("lock_explanation")]
  string LockExplanation,

  [property: JsonPropertyName("user_name")]
  string UserName,

  [property: JsonPropertyName("topic_children")]
  IEnumerable<uint> TopicChildren,

  [property: JsonPropertyName("podcast_url")]
  string PodcastUrl,

  [property: JsonPropertyName("discussion_type")]
  string DiscussionType,

  [property: JsonPropertyName("attachments")]
  IEnumerable<FileAttachmentModel> Attachments,

  [property: JsonPropertyName("permissions")]
  Dictionary<string, bool> Permissions,

  [property: JsonPropertyName("author")]
  UserDisplayModel Author,

  [property: JsonPropertyName("unread_count")]
  uint? UnreadCount = null,

  [property: JsonPropertyName("subscribed")]
  bool? Subscribed = null,

  [property: JsonPropertyName("posted_at")]
  DateTime? PostedAt = null,

  [property: JsonPropertyName("last_reply_at")]
  DateTime? LastReplyAt = null,

  [property: JsonPropertyName("require_initial_post")]
  bool? RequireInitialPost = null,

  [property: JsonPropertyName("user_can_see_posts")]
  bool? UserCanSeePosts = null,

  [property: JsonPropertyName("discussion_subentry_count")]
  uint? DiscussionSubentryCount = null,

  [property: JsonPropertyName("delayed_post_at")]
  DateTime? DelayedPostAt = null,

  [property: JsonPropertyName("published")]
  bool? Published = null,

  [property: JsonPropertyName("lock_at")]
  DateTime? LockAt = null,

  [property: JsonPropertyName("locked")]
  bool? Locked = null,

  [property: JsonPropertyName("pinned")]
  bool? Pinned = null,

  [property: JsonPropertyName("locked_for_user")]
  bool? LockedForUser = null,

  [property: JsonPropertyName("lock_info")]
  object? LockInfo = null,

  [property: JsonPropertyName("group_topic_children")]
  object? GroupTopicChildren = null,

  [property: JsonPropertyName("root_topic_id")]
  ulong? RootTopicId = null,

  [property: JsonPropertyName("group_category_id")]
  ulong? GroupCategoryId = null,

  [property: JsonPropertyName("allow_rating")]
  bool? AllowRating = null,

  [property: JsonPropertyName("only_graders_can_rate")]
  bool? OnlyGradersCanRate = null,

  [property: JsonPropertyName("sort_by_rating")]
  bool? SortByRating = null
);