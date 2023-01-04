using System.Collections.Generic;


namespace Model.Accounts {

    public class HelpLinkModel {
        
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("text")]
        public string Text { get; set; }
        
        [JsonPropertyName("subtext")]
        public string Subtext { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("available_to")]
        public IEnumerable<string> AvailableTo { get; set; }
    }
}