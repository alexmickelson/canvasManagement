

namespace CanvasModel.Assignments;
public class NeedsGradingCountModel
{

  [JsonPropertyName("section_id")]
  public string SectionId { get; set; }

  [JsonPropertyName("needs_grading_count")]
  public uint NeedsGradingCount { get; set; }
}