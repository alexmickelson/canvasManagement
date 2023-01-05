
namespace CanvasModel.GradeChangelog;
public class GradeChangeEventLinksModel
{

  [JsonPropertyName("assignment")]
  public ulong Assignment { get; set; }

  [JsonPropertyName("course")]
  public ulong Course { get; set; }

  [JsonPropertyName("student")]
  public ulong Student { get; set; }

  [JsonPropertyName("grader")]
  public ulong Grader { get; set; }

  [JsonPropertyName("page_view")]
  public string? PageView { get; set; }
}