using System;
using System.Collections.Generic;

using Model.Assignments;
using Model.Courses;
using Model.Submissions;
// 


namespace Model.Users {
    
    public class ActivityStreamObjectModel {
        
        // General
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("message")]
        public string Message { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("read_state")]
        public bool ReadState { get; set; }
        
        [JsonPropertyName("context_type")]
        public string ContextType { get; set; }
        
        [JsonPropertyName("course_id")]
        public ulong? CourseId { get; set; }
        
        [JsonPropertyName("group_id")]
        public ulong? GroupId { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }
        
        //
        // Type = DiscussionTopic | Announcement
        
        [JsonPropertyName("total_root_discussion_entries")]
        public uint? TotalRootDiscussionEntries { get; set; }
        
        [JsonPropertyName("require_initial_post")]
        public bool? RequireInitialPost { get; set; }
        
        [JsonPropertyName("user_has_posted")]
        public bool? UserHasPosted { get; set; }
        
        [JsonPropertyName("root_discussion_entries")]
        public object RootDiscussionEntries { get; set; } // todo this class/model
        
        //
        // Type = DiscussionTopic
        
        [JsonPropertyName("discussion_topic_id")]
        public ulong? DiscussionTopicId { get; set; }
        
        //
        // Type = Announcement
        
        [JsonPropertyName("announcement_id")]
        public ulong? AnnouncementId  { get; set; }
        
        //
        // Type = Conversation
        
        [JsonPropertyName("conversation_id")]
        public ulong? ConversationId { get; set; }
        
        [JsonPropertyName("private")]
        public bool? Private { get; set; } 
        
        [JsonPropertyName("participant_count")]
        public uint? ParticipantCount { get; set; }
        
        //
        // Type = Message
        
        [JsonPropertyName("message_id")]
        public ulong? MessageId { get; set; }
        
        [JsonPropertyName("notification_category")]
        public string NotificationCategory { get; set; }
        
        //
        // Type = Submission
        
        
        
        [JsonPropertyName("assignment_id")]
        public ulong? AssignmentId { get; set; }
        
        [JsonPropertyName("assignment")]
        public AssignmentModel? Assignment { get; set; }
        
        [JsonPropertyName("course")]
        public CourseModel? Course { get; set; }
        
        [JsonPropertyName("attempt")]
        public uint? Attempt { get; set; }
        
        [JsonPropertyName("body")]
        public string? Body { get; set; }
        
        [JsonPropertyName("grade")]
        public string Grade { get; set; }
        
        [JsonPropertyName("grade_matches_current_submission")]
        public bool? GradeMatchesCurrentSubmission { get; set; }

        [JsonPropertyName("preview_url")]
        public string PreviewUrl { get; set; }
        
        [JsonPropertyName("score")]
        public decimal? Score { get; set; }
        
        [JsonPropertyName("submission_comments")]
        public IEnumerable<SubmissionCommentModel>? SubmissionComments { get; set; }
        
        [JsonPropertyName("submission_type")]
        public string SubmissionType { get; set; }
        
        [JsonPropertyName("submitted_at")]
        public DateTime? SubmittedAt { get; set; }
        
        [JsonPropertyName("url")]
        public string? Url { get; set; }
        
        [JsonPropertyName("user_id")]
        public ulong? UserId { get; set; }
        
        [JsonPropertyName("grader_id")]
        public long? GraderId { get; set; } // why can this be negative???
        
        [JsonPropertyName("graded_at")]
        public DateTime? GradedAt { get; set; }
        
        [JsonPropertyName("user")]
        public UserModel? User { get; set; }
        
        [JsonPropertyName("late")]
        public bool? Late { get; set; }
        
        [JsonPropertyName("assignment_visible")]
        public bool? AssignmentVisible { get; set; }
        
        [JsonPropertyName("excused")]
        public bool? Excused { get; set; }
        
        [JsonPropertyName("missing")]
        public bool? Missing { get; set; }
        
        [JsonPropertyName("late_policy_status")]
        public string LatePolicyStatus { get; set; }
        
        [JsonPropertyName("points_deducted")]
        public double? PointsDeducted { get; set; }
        
        [JsonPropertyName("seconds_late")]
        public double? SecondsLate { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }

        [JsonPropertyName("extra_attempts")]
        public uint? ExtraAttempts { get; set; }
        
        [JsonPropertyName("anonymous_id")]
        public string? AnonymousId { get; set; }
        
        // 
        // Type = Conference
        
        [JsonPropertyName("web_conference_id")]
        public ulong? WebConferenceId { get; set; }
        
        //
        // Type = Collaboration
        
        [JsonPropertyName("collaboration_id")]
        public ulong? CollaborationId { get; set; }
        
        //
        // Type = AssignmentRequest
        
        [JsonPropertyName("assignment_request_id")]
        public ulong? AssignmentRequestId { get; set; }
        
        
    }
}