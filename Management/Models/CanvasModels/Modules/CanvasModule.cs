namespace CanvasModel.Modules;

public record CanvasModule(
  [property: JsonPropertyName("id")] ulong Id,
  [property: JsonPropertyName("workflow_state")] string WorkflowState,
  [property: JsonPropertyName("position")] uint Position,
  [property: JsonPropertyName("name")] string Name,
  [property: JsonPropertyName("unlock_at")] DateTime? UnlockAt,
  [property: JsonPropertyName("require_sequential_progress")] bool? RequireSequentialProgress,
  [property: JsonPropertyName("prerequisite_module_ids")] IEnumerable<ulong>? PrerequisiteModuleIds,
  [property: JsonPropertyName("items_count")] uint ItemsCount,
  [property: JsonPropertyName("items_url")] string ItemsUrl,
  // [OptIn]
  // [Enigmatic] // can be null if "the module is deemed too large", even if opted-in
  [property: JsonPropertyName("items")]
    IEnumerable<CanvasModuleItem>? Items,
  [property: JsonPropertyName("state")] string? State, // todo make sure this,
  // [OptIn]
  [property: JsonPropertyName("completed_at")]
    DateTime? CompletedAt,
  [property: JsonPropertyName("publish_final_grade")] bool? PublishFinalGrade,
  [property: JsonPropertyName("published")] bool? Published
);
