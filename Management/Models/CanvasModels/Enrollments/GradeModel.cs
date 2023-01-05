


namespace CanvasModel.Enrollments;
public record GradeModel
(
  [property: JsonPropertyName("html_url")]
  string? HtmlUrl = null,

  [property: JsonPropertyName("current_grade")]
  string? CurrentGrade = null,

  [property: JsonPropertyName("final_grade")]
  string? FinalGrade = null,

  [property: JsonPropertyName("current_score")]
  string? CurrentScore = null,

  [property: JsonPropertyName("final_score")]
  string? FinalScore = null,

  [property: JsonPropertyName("unposted_current_grade")]
  string? UnpostedCurrentGrade = null,

  [property: JsonPropertyName("unposted_final_grade")]
  string? UnpostedFinalGrade = null,

  [property: JsonPropertyName("unposted_current_score")]
  string? UnpostedCurrentScore = null,

  [property: JsonPropertyName("unposted_final_score")]
  string? UnpostedFinalScore = null
);