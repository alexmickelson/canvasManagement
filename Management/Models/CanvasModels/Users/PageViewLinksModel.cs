namespace CanvasModel.Users;

public record PageViewLinksModel
(
  [property: JsonPropertyName("user")]
  ulong User,

  [property: JsonPropertyName("context")]
  ulong? Context = null,

  [property: JsonPropertyName("asset")]
  ulong? Asset = null,

  [property: JsonPropertyName("real_user")]
  ulong? RealUser = null,

  [property: JsonPropertyName("account")]
  ulong? Account = null
);