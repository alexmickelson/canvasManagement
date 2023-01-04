using System.Collections.Generic;



namespace Model.Gradebook {
    
    public class SubmissionHistoryModel {
        
        [JsonPropertyName("submission_id")]
        public ulong SubmissionId { get; set; }
        
        [JsonPropertyName("versions")]
        public IEnumerable<SubmissionVersionModel>? Versions { get; set; }
    }
}