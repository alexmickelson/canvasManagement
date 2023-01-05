

namespace CanvasModel.Submissions;
public class MediaCommentModel
{

  [JsonPropertyName("content-type")]
  public string ContentType { get; set; }

  [JsonPropertyName("display_name")]
  public string DisplayName { get; set; }

  [JsonPropertyName("media_id")]
  public string MediaId { get; set; }

  [JsonPropertyName("media_type")]
  public string MediaType { get; set; }

  [JsonPropertyName("url")]
  public string Url { get; set; }
}