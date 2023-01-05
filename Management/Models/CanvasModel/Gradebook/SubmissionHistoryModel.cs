
namespace CanvasModel.Gradebook;
public class SubmissionHistoryModel
{

  [JsonPropertyName("submission_id")]
  public ulong SubmissionId { get; set; }

  [JsonPropertyName("versions")]
  public IEnumerable<SubmissionVersionModel>? Versions { get; set; }
}