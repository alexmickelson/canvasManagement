namespace CanvasModel.Users;

public record UserDisplayModel
(
  [property: JsonPropertyName("avatar_image_url")]
  string AvatarImageUrl,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl,

  [property: JsonPropertyName("id")]
  ulong? Id = null,

  [property: JsonPropertyName("short_name")]
  string? ShortName = null,

  [property: JsonPropertyName("display_name")]
  string? DisplayName = null,

  [property: JsonPropertyName("pronouns")]
  string? Pronouns = null,

  [property: JsonPropertyName("anonymous_id")]
  string AnonymousId = null
);