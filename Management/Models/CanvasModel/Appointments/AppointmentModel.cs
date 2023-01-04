using System;


namespace Model.Appointments {
    
    public class AppointmentModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("start_at")]
        public DateTime StartAt { get; set; }
        
        [JsonPropertyName("end_at")]
        public DateTime EndAt { get; set; }
    }
}
