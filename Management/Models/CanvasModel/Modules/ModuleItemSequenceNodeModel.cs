



namespace Model.Modules {
    public class ModuleItemSequenceNodeModel {
        
        [JsonPropertyName("prev")]
        public ModuleItemModel? Prev { get; set; }
        
        [JsonPropertyName("current")]
        public ModuleItemModel Current { get; set; }
        
        [JsonPropertyName("next")]
        public ModuleItemModel? Next { get; set; }
        
        [JsonPropertyName("mastery_path")]
        public object? MasteryPath { get; set; } // todo concrete type?
    }
}
