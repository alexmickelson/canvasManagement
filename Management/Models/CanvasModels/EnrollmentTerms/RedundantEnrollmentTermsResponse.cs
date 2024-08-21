namespace CanvasModel.EnrollmentTerms;

public record coRedundantEnrollmentTermsResponse
(
  [property: JsonPropertyName("enrollment_terms")]
    IEnumerable<EnrollmentTermModel> EnrollmentTerms
);
