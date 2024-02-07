namespace CanvasModel.Discussions;

public record FileAttachmentModel
(
  [property: JsonPropertyName("content_type")]
  string ContentType,

  [property: JsonPropertyName("url")]
  string Url,

  [property: JsonPropertyName("filename")]
  string Filename,

  [property: JsonPropertyName("display_name")]
  string DisplayName
);
