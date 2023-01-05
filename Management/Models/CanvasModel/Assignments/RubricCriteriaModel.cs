using System.Collections.Generic;



namespace CanvasModel.Assignments;

public class RubricCriteriaModel
{

  [JsonPropertyName("points")]
  public double? Points { get; set; }

  [JsonPropertyName("id")]
  public string Id { get; set; }

  [JsonPropertyName("learning_outcome_id")]
  public string? LearningOutcomeId { get; set; }

  [JsonPropertyName("vendor_guid")]
  public string? VendorGuid { get; set; }

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("long_description")]
  public string LongDescription { get; set; }

  [JsonPropertyName("criterion_use_range")]
  public bool? CriterionUseRange { get; set; }

  [JsonPropertyName("ratings")]
  public IEnumerable<RubricRatingModel>? Ratings { get; set; }

  [JsonPropertyName("ignore_for_scoring")]
  public bool? IgnoreForScoring { get; set; }
}