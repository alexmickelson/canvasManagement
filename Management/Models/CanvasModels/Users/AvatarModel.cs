namespace CanvasModel.Users;

public record AvatarModel
(
  [property: JsonPropertyName("type")]
  string Type,

  [property: JsonPropertyName("url")]
  string Url,

  [property: JsonPropertyName("token")]
  string Token,

  [property: JsonPropertyName("display_name")]
  string DisplayName,

  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("content_type")]
  string ContentType,

  [property: JsonPropertyName("filename")]
  string Filename,

  [property: JsonPropertyName("size")]
  ulong Size
);