namespace CanvasModel.Assignments;

public record NeedsGradingCountModel
(
  [property: JsonPropertyName("section_id")]
  string SectionId,

  [property: JsonPropertyName("needs_grading_count")]
  uint NeedsGradingCount
);