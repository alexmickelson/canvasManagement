
namespace CanvasModel.EnrollmentTerms;
record RedundantEnrollmentTermsResponse
(
  [property: JsonPropertyName("enrollment_terms")] 
    IEnumerable<EnrollmentTermModel> EnrollmentTerms
);
