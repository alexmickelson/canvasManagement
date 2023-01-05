using System;



namespace CanvasModel.Users;
public class PageViewModel
{

  [JsonPropertyName("id")]
  public string Id { get; set; }

  [JsonPropertyName("app_name")]
  public string AppName { get; set; }

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("context_type")]
  public string ContextType { get; set; }

  [JsonPropertyName("asset_type")]
  public string AssetType { get; set; }

  [JsonPropertyName("controller")]
  public string Controller { get; set; }

  [JsonPropertyName("action")]
  public string Action { get; set; }

  [JsonPropertyName("interaction_seconds")]
  public decimal? InteractionSeconds { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("user_request")]
  public bool? UserRequest { get; set; }

  [JsonPropertyName("render_time")]
  public double? RenderTime { get; set; }

  [JsonPropertyName("user_agent")]
  public string UserAgent { get; set; }

  [JsonPropertyName("participated")]
  public bool? Participated { get; set; }

  [JsonPropertyName("http_method")]
  public string HttpMethod { get; set; }

  [JsonPropertyName("remote_ip")]
  public string RemoteIp { get; set; }

  [JsonPropertyName("links")]
  public PageViewLinksModel Links { get; set; }


}