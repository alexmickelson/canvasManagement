using System;


namespace CanvasModel.Authentications;
// NOTE: the api documentation for this model is incorrect
public class AuthenticationEventModel
{

  [JsonPropertyName("id")]
  public string Id { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("event_type")]
  public string EventType { get; set; }

  [JsonPropertyName("links")]
  public AuthenticationEventLinksModel Links { get; set; }
}

public struct AuthenticationEventLinksModel
{

  [JsonPropertyName("login")]
  public ulong Login { get; set; }

  [JsonPropertyName("account")]
  public ulong Account { get; set; }

  [JsonPropertyName("user")]
  public ulong User { get; set; }

  [JsonPropertyName("page_view")]
  public ulong? PageView { get; set; }
}