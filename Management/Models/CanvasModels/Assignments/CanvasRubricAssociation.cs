namespace CanvasModel.Assignments;

public record CanvasRubricAssociation
{
  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("rubrid_id")]
  public ulong RubricId { get; set; }

  [JsonPropertyName("association_id")]
  public ulong AssociationId { get; set; }

  [JsonPropertyName("association_type")]
  public required string AssociationType { get; set; }

  [JsonPropertyName("use_for_grading")]
  public bool UseForGrading { get; set; }

  [JsonPropertyName("summary_data")]
  public string? SummaryDaata { get; set; }

  [JsonPropertyName("purpose")]
  public required string Purpose { get; set; }

  [JsonPropertyName("hide_score_total")]
  public bool? HideScoreTotal { get; set; }

  [JsonPropertyName("hide_points")]
  public bool HidePoints { get; set; }

  [JsonPropertyName("hide_outcome-results")]
  public bool HideOUtcomeResult { get; set; }

}