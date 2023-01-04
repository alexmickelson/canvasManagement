using System;
using System.Collections.Generic;


namespace Model.Gradebook {
    
    public class DayModel {
        
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("graders")]
        public IEnumerable<GraderModel> Graders { get; set; }
    }
}