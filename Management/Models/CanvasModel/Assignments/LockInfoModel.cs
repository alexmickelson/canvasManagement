using System;



namespace CanvasModel.Assignments;
public class LockInfoModel
{

  [JsonPropertyName("asset_string")]
  public string AssetString { get; set; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; set; }

  [JsonPropertyName("lock_at")]
  public DateTime? LockAt { get; set; }

  [JsonPropertyName("context_module")]
  public object? ContextModule { get; set; }

  [JsonPropertyName("manually_locked")]
  public bool? ManuallyLocked { get; set; }
}