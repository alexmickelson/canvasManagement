
namespace CanvasModel.Sections;
public class SectionModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("sis_section_id")]
  public string? SisSectionId { get; set; }

  [JsonPropertyName("integration_id")]
  public string? IntegrationId { get; set; }

  [JsonPropertyName("sis_import_id")]
  public ulong? SisImportId { get; set; }

  [JsonPropertyName("start_at")]
  public DateTime? StartAt { get; set; }

  [JsonPropertyName("end_at")]
  public DateTime? EndAt { get; set; }

  [JsonPropertyName("restrict_enrollments_to_section_dates")]
  public bool? RestrictEnrollmentsToSectionDates { get; set; }

  [JsonPropertyName("nonxlist_course_id")]
  public ulong? NonCrossListedCourseId { get; set; }

  [JsonPropertyName("total_students")]
  // [OptIn]
  public uint? TotalStudents { get; set; }
}
