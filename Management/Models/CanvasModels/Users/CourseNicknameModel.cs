namespace CanvasModel.Users;

public record CourseNicknameModel
(
  [property: JsonPropertyName("course_id")]
  ulong CourseId,

  [property: JsonPropertyName("name")]
  string Name,

  [property: JsonPropertyName("nickname")]
  string Nickname
);
