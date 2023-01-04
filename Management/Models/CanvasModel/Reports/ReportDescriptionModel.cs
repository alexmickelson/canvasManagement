using System.Collections.Generic;



namespace Model.Reports {
    
    // ReSharper disable MemberCanBePrivate.Global
    // ReSharper disable ClassNeverInstantiated.Global
    public class ReportDescriptionModel {
        
        [JsonPropertyName("report")]
        public string Report { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("parameters")]
        public Dictionary<string, ReportParameterDescriptionModel>? Parameters { get; set; }
    }

    public class ReportParameterDescriptionModel {
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("required")]
        public bool Required { get; set; }
    }
}