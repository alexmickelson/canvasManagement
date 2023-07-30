namespace CanvasModel.Modules;

public record CanvasCompletionRequirement(
  [property: JsonPropertyName("type")] string Type,
  [property: JsonPropertyName("min_score")] double? MinScore,
  [property: JsonPropertyName("completed")] bool? Completed
);
