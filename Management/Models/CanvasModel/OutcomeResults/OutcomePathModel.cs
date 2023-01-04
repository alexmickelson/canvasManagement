using System.Collections.Generic;



namespace Model.OutcomeResults {
    
    public struct OutcomePathModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("parts")]
        public IEnumerable<OutcomePathPartModel>? Parts { get; set; }
    }
}
