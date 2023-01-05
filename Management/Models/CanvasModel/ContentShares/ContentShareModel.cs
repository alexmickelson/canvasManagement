using System;
using System.Collections.Generic;


using CanvasModel.Courses;
using CanvasModel.Users;

namespace CanvasModel.ContentShares;
public class ContentShareModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("content_type")]
  public string ContentType { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime? UpdatedAt { get; set; }

  [JsonPropertyName("user_id")]
  public ulong? UserId { get; set; }

  [JsonPropertyName("sender")]
  public ShortUserModel? Sender { get; set; }

  [JsonPropertyName("receivers")]
  public IEnumerable<ShortUserModel>? Receivers { get; set; }

  [JsonPropertyName("source_course")]
  public ShortCourseModel? SourceCourse { get; set; }

  [JsonPropertyName("read_state")]
  public string ReadState { get; set; }

  [JsonPropertyName("content_export")]
  public ContentExportIdModel? ContentExport { get; set; }
}
