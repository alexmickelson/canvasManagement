namespace CanvasModel.Assignments;

public record CanvasLockInfo
(
  [property: JsonPropertyName("asset_string")]
  string AssetString,

  [property: JsonPropertyName("unlock_at")]
  DateTime? UnlockAt = null,

  [property: JsonPropertyName("lock_at")]
  DateTime? LockAt = null,

  [property: JsonPropertyName("context_module")]
  object? ContextModule = null,

  [property: JsonPropertyName("manually_locked")]
  bool? ManuallyLocked = null
);
