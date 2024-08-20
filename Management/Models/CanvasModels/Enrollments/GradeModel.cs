


namespace CanvasModel.Enrollments;
public record GradeModel
(
  [property: JsonPropertyName("html_url")]
  string? HtmlUrl = null,

  [property: JsonPropertyName("current_grade")]
  float? CurrentGrade = null,

  [property: JsonPropertyName("final_grade")]
  float? FinalGrade = null,

  [property: JsonPropertyName("current_score")]
  float? CurrentScore = null,

  [property: JsonPropertyName("final_score")]
  float? FinalScore = null,

  [property: JsonPropertyName("unposted_current_grade")]
  float? UnpostedCurrentGrade = null,

  [property: JsonPropertyName("unposted_final_grade")]
  float? UnpostedFinalGrade = null,

  [property: JsonPropertyName("unposted_current_score")]
  float? UnpostedCurrentScore = null,

  [property: JsonPropertyName("unposted_final_score")]
  float? UnpostedFinalScore = null
);
