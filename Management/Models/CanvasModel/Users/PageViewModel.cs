namespace CanvasModel.Users;

public record PageViewModel
(

  [property: JsonPropertyName("id")]
  string Id,

  [property: JsonPropertyName("app_name")]
  string AppName,

  [property: JsonPropertyName("url")]
  string Url,

  [property: JsonPropertyName("context_type")]
  string ContextType,

  [property: JsonPropertyName("asset_type")]
  string AssetType,

  [property: JsonPropertyName("controller")]
  string Controller,

  [property: JsonPropertyName("action")]
  string Action,

  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("links")]
  PageViewLinksModel Links,

  [property: JsonPropertyName("interaction_seconds")]
  decimal? InteractionSeconds = null,

  [property: JsonPropertyName("user_request")]
  bool? UserRequest = null,

  [property: JsonPropertyName("render_time")]
  double? RenderTime = null,

  [property: JsonPropertyName("user_agent")]
  string UserAgent = null,

  [property: JsonPropertyName("participated")]
  bool? Participated = null,

  [property: JsonPropertyName("http_method")]
  string HttpMethod = null,

  [property: JsonPropertyName("remote_ip")]
  string RemoteIp = null
);