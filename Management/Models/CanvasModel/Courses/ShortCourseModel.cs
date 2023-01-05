namespace CanvasModel.Courses;
public record ShortCourseModel
(
  [property: JsonPropertyName("id")] ulong Id,
  [property: JsonPropertyName("name")] string Name
);
