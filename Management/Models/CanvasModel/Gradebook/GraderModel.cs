using System.Collections.Generic;

using Model.Assignments;

namespace Model.Gradebook {
    
    public class GraderModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        // the docs say this is a list of integers, but it isn't.
        [JsonPropertyName("assignments")]
        public IEnumerable<AssignmentModel> Assignments { get; set; }
    }
}