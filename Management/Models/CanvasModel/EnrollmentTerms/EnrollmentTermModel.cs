using System;
using System.Collections.Generic;


namespace CanvasModel.EnrollmentTerms;
public class EnrollmentTermModel
{
  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("sis_term_id")]
  public string SisTermId { get; set; }

  [JsonPropertyName("sis_import_id")]
  public ulong? SisImportId { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("start_at")]
  public DateTime? StartAt { get; set; }

  [JsonPropertyName("end_at")]
  public DateTime? EndAt { get; set; }

  [JsonPropertyName("grading_period_group_id")]
  public ulong? GradingPeriodGroupId { get; set; }

  [JsonPropertyName("workflow_state")]
  public string WorkflowState { get; set; }

  [JsonPropertyName("overrides")]
  public Dictionary<string, EnrollmentTermDateOverrideModel> Overrides { get; set; }
}

public struct EnrollmentTermDateOverrideModel
{
  [JsonPropertyName("start_at")]
  public DateTime? StartAt { get; set; }

  [JsonPropertyName("end_at")]
  public DateTime? EndAt { get; set; }
}
