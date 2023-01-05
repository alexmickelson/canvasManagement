

namespace CanvasModel.ExternalTools;
public class MigrationSelectionModel
{

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("enabled")]
  public bool? Enabled { get; set; }

  [JsonPropertyName("message_type")]
  public string MessageType { get; set; }
}
