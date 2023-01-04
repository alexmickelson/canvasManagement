using System;
using System.Collections.Generic;


using Model.Calendar;

namespace Model.Appointments {
    
    public class AppointmentGroupModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("start_at")]
        public DateTime StartAt { get; set; }
        
        [JsonPropertyName("end_at")]
        public DateTime EndAt { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("location_name")]
        public string LocationName { get; set; }
        
        [JsonPropertyName("location_address")]
        public string LocationAddress { get; set; }
        
        [JsonPropertyName("participant_count")]
        public uint? ParticipantCount { get; set; }
        
        [JsonPropertyName("reserved_times")]
        public IEnumerable<AppointmentModel> ReservedTimes { get; set; }
        
        [JsonPropertyName("context_codes")]
        public IEnumerable<string> ContextCodes { get; set; }
        
        [JsonPropertyName("sub_context_codes")]
        public IEnumerable<string> SubContextCodes { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
        
        [JsonPropertyName("requiring_action")]
        public bool? RequiringAction { get; set; }
        
        [JsonPropertyName("appointments_count")]
        public uint AppointmentsCount { get; set; }
        
        [JsonPropertyName("appointments")]
        public IEnumerable<CalendarEventModel> Appointments { get; set; }
        
        [JsonPropertyName("new_appointments")]
        public IEnumerable<CalendarEventModel>? NewAppointments { get; set; }
        
        [JsonPropertyName("max_appointments_per_participant")]
        public uint? MaxAppointmentsPerParticipant { get; set; }
        
        [JsonPropertyName("min_appointments_per_participant")]
        public uint? MinAppointmentsPerParticipant { get; set; }
        
        [JsonPropertyName("participants_per_appointment")]
        public uint? ParticipantsPerAppointment { get; set; }
        
        [JsonPropertyName("participant_visibility")]
        public string ParticipantVisibility { get; set; }
        
        [JsonPropertyName("participant_type")]
        public string ParticipantType { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("html")]
        public string HtmlUrl { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
