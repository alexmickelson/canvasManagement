namespace CanvasModel.Assignments;

public record ExternalToolTagAttributesModel
(
  [property: JsonPropertyName("url")]
  string Url,

  [property: JsonPropertyName("resource_link_id")]
  string ResourceLinkId,

  [property: JsonPropertyName("new_tab")]
  bool? NewTab = null
);