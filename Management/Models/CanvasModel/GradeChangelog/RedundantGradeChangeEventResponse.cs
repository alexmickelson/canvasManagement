using System.Collections.Generic;


namespace Model.GradeChangelog {
    
    public class RedundantGradeChangeEventResponse {
        
        [JsonPropertyName("events")]
        public IEnumerable<GradeChangeEventModel> Events { get; set; }
    }
}