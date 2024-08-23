namespace CanvasModel.EnrollmentTerms;

public record RedundantEnrollmentTermsResponse
(
  [property: JsonPropertyName("enrollment_terms")]
    IEnumerable<EnrollmentTermModel> EnrollmentTerms
);
