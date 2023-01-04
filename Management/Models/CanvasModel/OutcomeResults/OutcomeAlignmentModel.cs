


namespace Model.OutcomeResults {
    
    public class OutcomeAlignmentModel {
        
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("html_url")]
        public string? HtmlUrl { get; set; }
    }
}
