namespace CanvasModel.Assignments;

public record CanvasRubric
{
  [JsonPropertyName("id")]
  public ulong? Id { get; set; }

  [JsonPropertyName("title")]
  public required string Title { get; set; }

  [JsonPropertyName("context_id")]
  public ulong ContextId { get; set; }

  [JsonPropertyName("context_type")]
  public required string ContextType { get; set; }

  [JsonPropertyName("points_possible")]
  public double PointsPossible { get; set; }

  [JsonPropertyName("reusable")]
  public bool Reusable { get; set; }

  [JsonPropertyName("read_only")]
  public bool ReadOnly { get; set; }

  // [JsonPropertyName("free_form_criterion_comments")]
  // public bool? FreeFormCriterionComments { get; set; }

  [JsonPropertyName("hide_score_total")]
  public bool? HideScoreTotal { get; set; }

  // [JsonPropertyName("data")]
  // public required IEnumerable<CanvasRubricCriteria> Data { get; set; }

  // assessments
  // associations
}