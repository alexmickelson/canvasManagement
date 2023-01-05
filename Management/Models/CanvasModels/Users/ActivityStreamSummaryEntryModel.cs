


namespace CanvasModel.Users;
public record ActivityStreamSummaryEntryModel
(
  [property: JsonPropertyName("type")]
  string Type,

  [property: JsonPropertyName("unread_count")]
  uint UnreadCount,

  [property: JsonPropertyName("count")]
  uint Count
);