


namespace CanvasModel.Discussions;
public class FileAttachmentModel
{

  [JsonPropertyName("content_type")]
  public string ContentType { get; set; }

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("filename")]
  public string Filename { get; set; }

  [JsonPropertyName("display_name")]
  public string DisplayName { get; set; }


}