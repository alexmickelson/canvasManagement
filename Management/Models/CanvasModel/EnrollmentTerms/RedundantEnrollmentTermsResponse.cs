using System.Collections.Generic;


namespace CanvasModel.EnrollmentTerms;
public struct RedundantEnrollmentTermsResponse
{
  [JsonPropertyName("enrollment_terms")]
  public IEnumerable<EnrollmentTermModel> EnrollmentTerms { get; set; }
}
