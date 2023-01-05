

namespace CanvasModel.Quizzes;
public class QuizPermissionsModel
{

  [JsonPropertyName("read")]
  public bool Read { get; set; }

  [JsonPropertyName("submit")]
  public bool Submit { get; set; }

  [JsonPropertyName("create")]
  public bool Create { get; set; }

  [JsonPropertyName("manage")]
  public bool Manage { get; set; }

  [JsonPropertyName("read_statistics")]
  public bool ReadStatistics { get; set; }

  [JsonPropertyName("review_grades")]
  public bool ReviewGrades { get; set; }

  [JsonPropertyName("update")]
  public bool Update { get; set; }
}
