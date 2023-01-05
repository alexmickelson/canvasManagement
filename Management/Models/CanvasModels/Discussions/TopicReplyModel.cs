namespace CanvasModel.Discussions;

public record TopicReplyModel
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

  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("editor_id")]
  ulong? EditorId = null,

  [property: JsonPropertyName("forced_read_state")]
  bool? ForcedReadState = null
);