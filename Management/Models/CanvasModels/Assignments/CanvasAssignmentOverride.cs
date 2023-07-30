namespace CanvasModel.Assignments;

public record CanvasAssignmentOverride
(

  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("assignment_id")]
  ulong AssignmentId,

  [property: JsonPropertyName("course_section_ids")]
  ulong CourseSectionId,

  [property: JsonPropertyName("title")]
  string Title,

  [property: JsonPropertyName("student_ids")]
  IEnumerable<ulong>? StudentIds = null,

  [property: JsonPropertyName("group_id")]
  ulong? GroupId = null,

  [property: JsonPropertyName("due_at")]
  DateTime? DueAt = null,

  [property: JsonPropertyName("all_day")]
  bool? AllDay = null,

  [property: JsonPropertyName("all_day_date")]
  DateTime? AllDayDate = null,

  [property: JsonPropertyName("unlock_at")]
  DateTime? UnlockAt = null,

  [property: JsonPropertyName("lock_at")]
  DateTime? LockAt = null
);