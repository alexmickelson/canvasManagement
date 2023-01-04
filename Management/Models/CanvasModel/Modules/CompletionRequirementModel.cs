

namespace Model.Modules {
    
    public class CompletionRequirementModel {
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("min_score")]
        public double? MinScore { get; set; }
        
        [JsonPropertyName("completed")]
        public bool? Completed { get; set; }
    }
}
