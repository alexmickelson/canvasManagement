

namespace CanvasModel.CustomGradebookColumns;
public class CustomColumnModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("teacher_notes")]
  public bool? TeacherNotes { get; set; }

  [JsonPropertyName("title")]
  public string Title { get; set; }

  [JsonPropertyName("position")]
  public int? Position { get; set; }

  [JsonPropertyName("hidden")]
  public bool? Hidden { get; set; }

  [JsonPropertyName("read_only")]
  public bool? ReadOnly { get; set; }
}
