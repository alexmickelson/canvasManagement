
namespace CanvasModel.SisImports;
public class SisImportCountsModel
{

  [JsonPropertyName("accounts")]
  public ulong Accounts { get; set; }

  [JsonPropertyName("terms")]
  public ulong Terms { get; set; }

  [JsonPropertyName("abstract_courses")]
  public ulong AbstractCourses { get; set; }

  [JsonPropertyName("courses")]
  public ulong Courses { get; set; }

  [JsonPropertyName("sections")]
  public ulong Sections { get; set; }

  [JsonPropertyName("xlists")]
  public ulong CrossLists { get; set; }

  [JsonPropertyName("users")]
  public ulong Users { get; set; }

  [JsonPropertyName("enrollments")]
  public ulong Enrollments { get; set; }

  [JsonPropertyName("groups")]
  public ulong Groups { get; set; }

  [JsonPropertyName("group_memberships")]
  public ulong GroupMemberships { get; set; }

  [JsonPropertyName("grade_publishing_results")]
  public ulong GradePublishingResults { get; set; }

  // the following three specific fields are null when 0, unlike the other ones which are 0 when 0

  [JsonPropertyName("batch_courses_deleted")]
  public ulong? BatchCoursesDeleted { get; set; }

  [JsonPropertyName("batch_sections_deleted")]
  public ulong? BatchSectionsDeleted { get; set; }

  [JsonPropertyName("batch_enrollments_deleted")]
  public ulong? BatchEnrollmentsDeleted { get; set; }

  [JsonPropertyName("error_count")]
  public ulong Errors { get; set; }

  [JsonPropertyName("warning_count")]
  public ulong Warnings { get; set; }
}
