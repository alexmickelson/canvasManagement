using CanvasModel.Submissions;

namespace CanvasModel.Gradebook;
public class SubmissionVersionModel : SubmissionModel
{

  [JsonPropertyName("assignment_name")]
  public string AssignmentName { get; set; }

  [JsonPropertyName("current_grade")]
  public string CurrentGrade { get; set; }

  [JsonPropertyName("current_graded_at")]
  public DateTime? CurrentGradedAt { get; set; }

  [JsonPropertyName("current_grader")]
  public string CurrentGrader { get; set; }

  [JsonPropertyName("new_grade")]
  public string NewGrade { get; set; }

  [JsonPropertyName("new_graded_at")]
  public DateTime? NewGradedAt { get; set; }

  [JsonPropertyName("new_grader")]
  public string NewGrader { get; set; }

  [JsonPropertyName("previous_grade")]
  public string PreviousGrade { get; set; }

  [JsonPropertyName("previous_graded_at")]
  public DateTime? PreviousGradedAt { get; set; }

  [JsonPropertyName("previous_grader")]
  public string PreviousGrader { get; set; }
}