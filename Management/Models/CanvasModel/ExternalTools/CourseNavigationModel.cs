

namespace CanvasModel.ExternalTools;
public class CourseNavigationModel
{

  [JsonPropertyName("enabled")]
  public bool? Enabled { get; set; }

  [JsonPropertyName("text")]
  public string Text { get; set; }

  [JsonPropertyName("visible")]
  public string Visibility { get; set; }

  [JsonPropertyName("window_target")]
  public string WindowTarget { get; set; }

  [JsonPropertyName("default")]
  public bool? Default { get; set; }

  [JsonPropertyName("display_type")]
  public string DisplayType { get; set; }
}
