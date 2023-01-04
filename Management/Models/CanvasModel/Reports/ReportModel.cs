using System;
using System.Collections.Generic;



using Model.Discussions;

namespace Model.Reports {
    
    public class ReportModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("report")]
        public string Report { get; set; }
        
        [JsonPropertyName("file_url")]
        public string? FileUrl { get; set; }
        
        [JsonPropertyName("attachment")]
        public FileAttachmentModel? Attachment { get; set; }
        
        [JsonPropertyName("status")]
        public string Status { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonPropertyName("started_at")]
        public DateTime? StartedAt { get; set; }
        
        [JsonPropertyName("ended_at")]
        public DateTime? EndedAt { get; set; }
        
        // the fields in this object can vary wildly depending on the report type, so for now we will loosely type it
        // like this
        [JsonPropertyName("parameters")]
        public Dictionary<string, object> Parameters { get; set; }
        
        [JsonPropertyName("progress")]
        public double? Progress { get; set; }
        
        [JsonPropertyName("current_line")]
        public ulong? CurrentLine { get; set; }
    }
}