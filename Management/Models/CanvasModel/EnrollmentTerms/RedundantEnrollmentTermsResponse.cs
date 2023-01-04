using System.Collections.Generic;


namespace Model.EnrollmentTerms {
    public struct RedundantEnrollmentTermsResponse {
        [JsonPropertyName("enrollment_terms")]
        public IEnumerable<EnrollmentTermModel> EnrollmentTerms { get; set; }
    }
}
