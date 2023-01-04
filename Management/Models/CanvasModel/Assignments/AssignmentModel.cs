using System;
using System.Collections.Generic;


using Model.Discussions;
using Model.Submissions;

namespace Model.Assignments {
    
    public class AssignmentModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [JsonPropertyName("due_at")]
        public DateTime? DueAt { get; set; }
        
        [JsonPropertyName("lock_at")]
        public DateTime? LockAt { get; set; }
        
        [JsonPropertyName("unlock_at")]
        public DateTime? UnlockAt { get; set; }
        
        [JsonPropertyName("has_overrides")]
        public bool HasOverrides { get; set; }
        
        [JsonPropertyName("all_dates")]
        public IEnumerable<AssignmentDateModel>? AllDates { get; set; }
        
        [JsonPropertyName("course_id")]
        public ulong CourseId { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }
        
        [JsonPropertyName("submissions_download_url")]
        public string SubmissionsDownloadUrl { get; set; }
        
        [JsonPropertyName("assignment_group_id")]
        public ulong AssignmentGroupId { get; set; }
        
        [JsonPropertyName("due_date_required")]
        public bool DueDateRequired { get; set; }
        
        [JsonPropertyName("allowed_extensions")]
        public IEnumerable<string>? AllowedExtensions { get; set; }
        
        [JsonPropertyName("max_name_length")]
        public uint MaxNameLength { get; set; }
        
        [JsonPropertyName("turnitin_enabled")]
        public bool? TurnitinEnabled { get; set; }
        
        [JsonPropertyName("vericite_enabled")]
        public bool? VeriCiteEnabled { get; set; } 
        
        [JsonPropertyName("turnitin_settings")]
        public TurnitinSettingsModel? TurnitinSettings { get; set; }
        
        [JsonPropertyName("grade_group_students_individually")]
        public bool? GradeGroupStudentsIndividually { get; set; }
        
        [JsonPropertyName("external_tool_tag_attributes")]
        public ExternalToolTagAttributesModel? ExternalToolTagAttributes { get; set; }
        
        [JsonPropertyName("peer_reviews")]
        public bool PeerReviews { get; set; }
        
        [JsonPropertyName("automatic_peer_reviews")]
        public bool AutomaticPeerReviews { get; set; }
        
        [JsonPropertyName("peer_review_count")]
        public uint? PeerReviewCount { get; set; }
        
        [JsonPropertyName("peer_reviews_assign_at")]
        public DateTime? PeerReviewsAssignAt { get; set; }
        
        [JsonPropertyName("intra_group_peer_reviews")]
        public bool? IntraGroupPeerReviews { get; set; }
        
        [JsonPropertyName("group_category_id")]
        public ulong? GroupCategoryId { get; set; }
        
        [JsonPropertyName("needs_grading_count")]
        public uint? NeedsGradingCount { get; set; }
        
        [JsonPropertyName("needs_grading_count_be_section")]
        public IEnumerable<NeedsGradingCountModel>? NeedsGradingCountBySection { get; set; }
        
        [JsonPropertyName("position")]
        public ulong Position { get; set; }
        
        [JsonPropertyName("post_to_sis")]
        public bool? PostToSis { get; set; }
        
        [JsonPropertyName("integration_id")]
        public string? IntegrationId { get; set; }
        
        [JsonPropertyName("integration_data")]
        public object? IntegrationData { get; set; }
        
        [JsonPropertyName("muted")]
        public bool? Muted { get; set; }
        
        [JsonPropertyName("points_possible")]
        public double? PointsPossible { get; set; }
        
        [JsonPropertyName("submission_types")]
        public IEnumerable<string> SubmissionTypes { get; set; }
        
        [JsonPropertyName("has_submitted_submissions")]
        public bool? HasSubmittedSubmissions { get; set; }
        
        [JsonPropertyName("grading_type")]
        public string GradingType { get; set; }

        [JsonPropertyName("grading_standard_id")]
        public ulong? GradingStandardId { get; set; }

        [JsonPropertyName("published")]
        public bool Published { get; set; }
        
        [JsonPropertyName("unpublishable")]
        public bool Unpublishable { get; set; }
        
        [JsonPropertyName("only_visible_to_overrides")]
        public bool OnlyVisibleToOverrides { get; set; }
        
        [JsonPropertyName("locked_for_user")]
        public bool LockedForUser { get; set; }
        
        [JsonPropertyName("lock_info")]
        public LockInfoModel? LockInfo { get; set; }
        
        [JsonPropertyName("lock_explanation")]
        public string? LockExplanation { get; set; }
        
        [JsonPropertyName("quiz_id")]
        public ulong? QuizId { get; set; }
        
        [JsonPropertyName("anonymous_submissions")]
        public bool? AnonymousSubmissions { get; set; }
        
        [JsonPropertyName("discussion_topic")]
        public DiscussionTopicModel? DiscussionTopic { get; set; }
        
        [JsonPropertyName("freeze_on_copy")]
        public bool? FreezeOnCopy { get; set; }
        
        [JsonPropertyName("frozen")]
        public bool? Frozen { get; set; }
        
        [JsonPropertyName("frozen_attributes")]
        public IEnumerable<string>? FrozenAttributes { get; set; }
        
        [JsonPropertyName("submission")]
        public SubmissionModel? Submission { get; set; }
        
        [JsonPropertyName("use_rubric_for_grading")]
        public bool? UseRubricForGrading { get; set; }
        
        [JsonPropertyName("rubric_settings")]
        public object? RubricSettings { get; set; } // again, docs give no concrete type.
        
        [JsonPropertyName("rubric")]
        public IEnumerable<RubricCriteriaModel>? Rubric { get; set; } 
        
        [JsonPropertyName("assignment_visibility")]
        public IEnumerable<ulong>? AssignmentVisibility { get; set; }
        
        [JsonPropertyName("overrides")]
        public IEnumerable<AssignmentOverrideModel>? Overrides { get; set; }
        
        [JsonPropertyName("omit_from_final_grade")]
        public bool? OmitFromFinalGrade { get; set; }
        
        [JsonPropertyName("moderated_grading")]
        public bool ModeratedGrading { get; set; }
        
        [JsonPropertyName("grader_count")]
        public uint GraderCount { get; set; }
        
        [JsonPropertyName("final_grader_id")]
        public ulong? FinalGraderId { get; set; }
        
        [JsonPropertyName("grader_comments_visible_to_graders")]
        public bool? GraderCommentsVisibleToGraders { get; set; }
        
        [JsonPropertyName("graders_anonymous_to_graders")]
        public bool? GradersAnonymousToGraders { get; set; }
        
        [JsonPropertyName("grader_names_anonymous_to_final_grader")]
        public bool? GraderNamesVisibleToFinalGrader { get; set; }
        
        [JsonPropertyName("anonymous_grading")]
        public bool? AnonymousGrading { get; set; }
        
        [JsonPropertyName("allowed_attempts")]
        public int AllowedAttempts { get; set; }
    }
}