

namespace Model.Results {
    
    public class ResultModel {
        // yes indeed the docs say this model specifically uses camelCase properties

        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("userId")]
        public string UserId { get; set; }
        
        [JsonPropertyName("resultScore")]
        public string ResultScore { get; set; }
        
        [JsonPropertyName("resultMaximum")]
        public string ResultMaximum { get; set; }
        
        [JsonPropertyName("comment")]
        public string Comment { get; set; }
        
        [JsonPropertyName("scoreOf")]
        public string ScoreOf { get; set; }
    }
}
