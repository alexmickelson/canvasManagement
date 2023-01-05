
namespace CanvasModel.Courses;
public record CourseProgressModel
(
  [property: JsonPropertyName("requirement_count")] 
  uint? RequirementCount = null,
  
  [property: JsonPropertyName("requirement_completed_count")] 
  uint? RequirementCompletedCount = null,

  [property: JsonPropertyName("next_requirement_url")] 
  string? NextRequirementUrl = null,

  [property: JsonPropertyName("completed_at")] 
  DateTime? CompletedAt = null
);