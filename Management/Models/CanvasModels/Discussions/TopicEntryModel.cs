namespace CanvasModel.Discussions;

public record TopicEntryModel
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("user_id")]
  ulong UserId,

  [property: JsonPropertyName("user_name")]
  string UserName,

  [property: JsonPropertyName("message")]
  string Message,

  [property: JsonPropertyName("read_state")]
  string ReadState,

  [property: JsonPropertyName("forced_read_state")]
  bool ForcedReadState,

  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("editor_id")]
  ulong? EditorId = null,

  [property: JsonPropertyName("updated_at")]
  DateTime? UpdatedAt = null,

  [property: JsonPropertyName("attachment")]
  FileAttachmentModel? Attachment = null,

  [property: JsonPropertyName("recent_replies")]
  IEnumerable<TopicReplyModel>? RecentReplies = null,

  [property: JsonPropertyName("has_more_replies")]
  bool? HasMoreReplies = null
);
