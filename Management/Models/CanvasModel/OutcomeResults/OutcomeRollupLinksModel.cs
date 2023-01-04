

namespace Model.OutcomeResults {
    
    public class OutcomeRollupLinksModel {
        
        [JsonPropertyName("course")]
        public ulong? Course { get; set; }
        
        [JsonPropertyName("user")]
        public ulong? User { get; set; }
        
        [JsonPropertyName("section")]
        public ulong? Section { get; set; }
    }
}
