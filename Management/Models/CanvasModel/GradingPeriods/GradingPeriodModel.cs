using System;


namespace Model.GradingPeriods {
    public class GradingPeriodModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("start_date")]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("end_date")]
        public DateTime? EndDate { get; set; }
        
        [JsonPropertyName("close_date")]
        public DateTime? CloseDate { get; set; }
        
        [JsonPropertyName("weight")]
        public double? Weight { get; set; }
        
        [JsonPropertyName("is_closed")]
        public bool? IsClosed { get; set; }
    }
}
