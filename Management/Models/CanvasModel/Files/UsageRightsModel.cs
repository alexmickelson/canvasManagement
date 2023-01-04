using System.Collections.Generic;


namespace Model.Files {
    public class UsageRightsModel {
        
        [JsonPropertyName("legal_copyright")]
        public string LegalCopyright { get; set; }
        
        [JsonPropertyName("use_justification")]
        public string UsageJustification { get; set; }
        
        [JsonPropertyName("license")]
        public string License { get; set; }
        
        [JsonPropertyName("license_name")]
        public string LicenseName { get; set; }
        
        [JsonPropertyName("message")]
        public string Message { get; set; }
        
        [JsonPropertyName("file_ids")]
        public IEnumerable<ulong> FileIds { get; set; }
    }
}
