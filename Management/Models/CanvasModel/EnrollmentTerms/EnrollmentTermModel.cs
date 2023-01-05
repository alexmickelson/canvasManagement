namespace CanvasModel.EnrollmentTerms;

record EnrollmentTermModel
(
  [property: JsonPropertyName("id")] ulong Id,
  [property: JsonPropertyName("name")] string Name,
  [property: JsonPropertyName("sis_term_id")] string? SisTermId = null,
  [property: JsonPropertyName("sis_import_id")] ulong? SisImportId = null,
  [property: JsonPropertyName("start_at")] DateTime? StartAt = null,
  [property: JsonPropertyName("end_at")] DateTime? EndAt = null,
  [property: JsonPropertyName("grading_period_group_id")] ulong? GradingPeriodGroupId = null,
  [property: JsonPropertyName("workflow_state")] string? WorkflowState = null,
  [property: JsonPropertyName("overrides")]
    Dictionary<string, EnrollmentTermDateOverrideModel>? Overrides = null
);

record EnrollmentTermDateOverrideModel
(
  [property: JsonPropertyName("start_at")] DateTime? StartAt = null,
  [property: JsonPropertyName("end_at")] DateTime? EndAt = null
);
