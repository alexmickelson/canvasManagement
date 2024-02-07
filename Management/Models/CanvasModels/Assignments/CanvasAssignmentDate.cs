namespace CanvasModel.Assignments;

public record CanvasAssignmentDate
(
  [property: JsonPropertyName("title")]
  string Title,

  [property: JsonPropertyName("id")]
  ulong? Id = null,

  [property: JsonPropertyName("base")]
  bool? Base = null,

  [property: JsonPropertyName("due_at")]
  DateTime? DueAt = null,

  [property: JsonPropertyName("unlock_at")]
  DateTime? UnlockAt = null,

  [property: JsonPropertyName("lock_at")]
  DateTime? LockAt = null
);
