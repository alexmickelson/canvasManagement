


namespace CanvasModel.Users;
public class PageViewLinksModel
{

  [JsonPropertyName("user")]
  public ulong User { get; set; }

  [JsonPropertyName("context")]
  public ulong? Context { get; set; }

  [JsonPropertyName("asset")]
  public ulong? Asset { get; set; }

  [JsonPropertyName("real_user")]
  public ulong? RealUser { get; set; }

  [JsonPropertyName("account")]
  public ulong? Account { get; set; }


}