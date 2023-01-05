namespace CanvasModel.Assignments;

public record RubricCriteriaModel
(
  [property: JsonPropertyName("id")]
  string Id,

  [property: JsonPropertyName("description")]
  string Description,

  [property: JsonPropertyName("long_description")]
  string LongDescription,

  [property: JsonPropertyName("points")]
  double? Points,
  [property: JsonPropertyName("learning_outcome_id")]
  string? LearningOutcomeId,

  [property: JsonPropertyName("vendor_guid")]
  string? VendorGuid,

  [property: JsonPropertyName("criterion_use_range")]
  bool? CriterionUseRange = null,

  [property: JsonPropertyName("ratings")]
  IEnumerable<RubricRatingModel>? Ratings = null,

  [property: JsonPropertyName("ignore_for_scoring")]
  bool? IgnoreForScoring = null
);