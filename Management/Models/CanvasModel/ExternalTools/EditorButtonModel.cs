

namespace CanvasModel.ExternalTools;
public class EditorButtonModel
{

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("enabled")]
  public bool? Enabled { get; set; }

  [JsonPropertyName("icon_url")]
  public string IconUrl { get; set; }

  [JsonPropertyName("selection_width")]
  public uint? SelectionWidth { get; set; }

  [JsonPropertyName("selection_height")]
  public uint? SelectionHeight { get; set; }

  [JsonPropertyName("message_type")]
  public string MessageType { get; set; }
}
