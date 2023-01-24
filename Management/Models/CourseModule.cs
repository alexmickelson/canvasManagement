using System.ComponentModel.DataAnnotations;

public record CourseModule(
  [property: Required]
  [property: StringLength(50, ErrorMessage = "Name too long (50 character limit).")]
  string Name,
  IEnumerable<LocalAssignment>? Assignments
)
{
  public IEnumerable<LocalAssignment> Assignments = Assignments ?? new LocalAssignment[] { };
}