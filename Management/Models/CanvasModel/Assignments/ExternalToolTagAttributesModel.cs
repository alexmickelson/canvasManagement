

namespace CanvasModel.Assignments;
public class ExternalToolTagAttributesModel
{

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("new_tab")]
  public bool? NewTab { get; set; }

  [JsonPropertyName("resource_link_id")]
  public string ResourceLinkId { get; set; }
}