
namespace CanvasModel.GradeChangelog;
public class RedundantGradeChangeEventResponse
{

  [JsonPropertyName("events")]
  public IEnumerable<GradeChangeEventModel> Events { get; set; }
}