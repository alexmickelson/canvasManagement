using System.Collections.Generic;


namespace Model.Modules {
    
    public class ModuleItemSequenceModel {
        
        [JsonPropertyName("items")]
        public IEnumerable<ModuleItemSequenceNodeModel> Items { get; set; }
    }
}
