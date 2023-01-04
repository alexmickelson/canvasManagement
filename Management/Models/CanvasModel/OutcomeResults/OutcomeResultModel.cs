using System;
using System.Collections.Generic;


namespace Model.OutcomeResults {
    
    public class OutcomeResultModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("score")]
        public double Score { get; set; }
        
        [JsonPropertyName("submitted_or_assessed_at")]
        public DateTime SubmittedOrAssessedAt { get; set; }
        
        [JsonPropertyName("links")]
        public Dictionary<string, object> Links { get; set; } // todo
        
        [JsonPropertyName("percent")]
        public decimal Percent { get; set; }
    }
}
