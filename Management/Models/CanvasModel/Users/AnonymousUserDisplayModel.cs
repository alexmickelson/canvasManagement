namespace CanvasModel.Users;

public record AnonymousUserDisplayModel
(
  [property: JsonPropertyName("anonymous_id")]
  string AnonymousId,

  [property: JsonPropertyName("avatar_image_url")]
  string AvatarImageUrl
);