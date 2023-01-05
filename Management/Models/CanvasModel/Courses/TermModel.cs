
namespace CanvasModel.Courses;
public class TermModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("start_at")]
  public DateTime? StartAt { get; set; }

  [JsonPropertyName("end_at")]
  public DateTime? EndAt { get; set; }
}