

namespace Model.Assignments {
    
    public class RubricRatingModel {
        
        [JsonPropertyName("points")]
        public double Points { get; set; }
        
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("long_description")]
        public string LongDescription { get; set; }
    }
}