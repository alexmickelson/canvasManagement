


namespace CanvasModel.Enrollments;
public class GradeModel
{

  [JsonPropertyName("html_url")]
  public string? HtmlUrl { get; set; }

  [JsonPropertyName("current_grade")]
  public string? CurrentGrade { get; set; }

  [JsonPropertyName("final_grade")]
  public string? FinalGrade { get; set; }

  [JsonPropertyName("current_score")]
  public string? CurrentScore { get; set; }

  [JsonPropertyName("final_score")]
  public string? FinalScore { get; set; }

  [JsonPropertyName("unposted_current_grade")]
  public string? UnpostedCurrentGrade { get; set; }

  [JsonPropertyName("unposted_final_grade")]
  public string? UnpostedFinalGrade { get; set; }

  [JsonPropertyName("unposted_current_score")]
  public string? UnpostedCurrentScore { get; set; }

  [JsonPropertyName("unposted_final_score")]
  public string? UnpostedFinalScore { get; set; }
}