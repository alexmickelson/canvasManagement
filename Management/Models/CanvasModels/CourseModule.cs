using System.ComponentModel.DataAnnotations;

namespace CanvasModel;

public record CourseModule(
  [property: JsonPropertyName("id")] ulong Id,
  [property: JsonPropertyName("name")] string Name
  // [property: JsonPropertyName("start_at")] DateTime StartAt,
  // [property: JsonPropertyName("end_at")] DateTime EndAt,
  // [property: JsonPropertyName("description")] string Description
);
