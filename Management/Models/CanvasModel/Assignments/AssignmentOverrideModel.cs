using System;
using System.Collections.Generic;



namespace Model.Assignments {
    
    public class AssignmentOverrideModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("assignment_id")]
        public ulong AssignmentId { get; set; }
        
        [JsonPropertyName("student_ids")]
        public IEnumerable<ulong>? StudentIds { get; set; }
        
        [JsonPropertyName("group_id")]
        public ulong? GroupId { get; set; }
        
        [JsonPropertyName("course_section_ids")]
        public ulong CourseSectionId { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("due_at")]
        public DateTime? DueAt { get; set; }
        
        [JsonPropertyName("all_day")]
        public bool? AllDay { get; set; }
        
        [JsonPropertyName("all_day_date")]
        public DateTime? AllDayDate { get; set; }
        
        [JsonPropertyName("unlock_at")]
        public DateTime? UnlockAt { get; set; }
        
        [JsonPropertyName("lock_at")]
        public DateTime? LockAt { get; set; }
    }
}