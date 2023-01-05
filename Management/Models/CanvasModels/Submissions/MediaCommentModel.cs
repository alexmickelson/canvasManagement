namespace CanvasModel.Submissions;
public record MediaCommentModel
(

  [property: JsonPropertyName("content-type")]
  string ContentType,

  [property: JsonPropertyName("display_name")]
  string DisplayName,

  [property: JsonPropertyName("media_id")]
  string MediaId,

  [property: JsonPropertyName("media_type")]
  string MediaType,

  [property: JsonPropertyName("url")]
  string Url
);