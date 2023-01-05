namespace CanvasModel.Users;

public record ShortUserModel
(

  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("display_name")]
  string DisplayName,

  [property: JsonPropertyName("avatar_image_url")]
  string AvatarImageUrl,

  [property: JsonPropertyName("html_url")]
  string HtmlUrl
);
