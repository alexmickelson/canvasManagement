using System;
using System.Collections.Generic;


namespace Model.Analytics {
    
    public struct UserParticipationModel {
        
        [JsonPropertyName("page_views")]
        public Dictionary<DateTime, ulong> PageViews { get; set; }
        
        [JsonPropertyName("participations")]
        public IEnumerable<UserParticipationEventModel> Participations { get; set; }
    }

    public struct UserParticipationEventModel {
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
