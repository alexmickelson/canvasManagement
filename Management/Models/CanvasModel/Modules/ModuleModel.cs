
namespace CanvasModel.Modules;
public class ModuleModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("workflow_state")]
  public string WorkflowState { get; set; }

  [JsonPropertyName("position")]
  public uint Position { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; set; }

  [JsonPropertyName("require_sequential_progress")]
  public bool? RequireSequentialProgress { get; set; }

  [JsonPropertyName("prerequisite_module_ids")]
  public IEnumerable<ulong>? PrerequisiteModuleIds { get; set; }

  [JsonPropertyName("items_count")]
  public uint ItemsCount { get; set; }

  [JsonPropertyName("items_url")]
  public string ItemsUrl { get; set; }

  // [OptIn]
  // [Enigmatic] // can be null if "the module is deemed too large", even if opted-in
  [JsonPropertyName("items")]
  public IEnumerable<ModuleItemModel>? Items { get; set; }

  [JsonPropertyName("state")]
  public string? State { get; set; } // todo make sure this is an enum in Structure class

  // [OptIn]
  [JsonPropertyName("completed_at")]
  public DateTime? CompletedAt { get; set; }

  [JsonPropertyName("publish_final_grade")]
  public bool? PublishFinalGrade { get; set; }

  [JsonPropertyName("published")]
  public bool? Published { get; set; }
}
