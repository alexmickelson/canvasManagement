

namespace CanvasModel.Courses;
public class ShortCourseModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }
}
