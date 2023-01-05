
namespace CanvasModel.Modules;
public class ContentDetailsModel
{

  [JsonPropertyName("points_possible")]
  public uint? PointsPossible { get; set; }

  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; set; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; set; }

  [JsonPropertyName("lock_at")]
  public DateTime? LockAt { get; set; }

  [JsonPropertyName("locked_for_user")]
  public bool? LockedForUser { get; set; }

  [JsonPropertyName("lock_explanation")]
  public string? LockExplanation { get; set; }
}
