using System.Collections.Generic;



namespace Model.OutcomeResults {
    
    public class OutcomeRollupModel {
        
        [JsonPropertyName("scores")]
        public IEnumerable<OutcomeRollupScoreModel>? Scores { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("links")]
        public OutcomeRollupLinksModel Links { get; set; }
    }
}
