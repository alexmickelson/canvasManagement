

namespace CanvasModel.ExternalTools;
public class UserNavigationModel
{

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("enabled")]
  public bool? Enabled { get; set; }

  [JsonPropertyName("text")]
  public string Text { get; set; }

  [JsonPropertyName("visibility")]
  public string Visibility { get; set; }
}
