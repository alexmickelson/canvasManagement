using System;
using System.Collections.Generic;

using Model.Users;


namespace Model.Discussions {
    
    public class DiscussionTopicModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("message")]
        public string Message { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }
        
        [JsonPropertyName("posted_at")]
        public DateTime? PostedAt { get; set; }
        
        [JsonPropertyName("last_reply_at")]
        public DateTime? LastReplyAt { get; set; }
        
        [JsonPropertyName("require_initial_post")]
        public bool? RequireInitialPost { get; set; }
        
        [JsonPropertyName("user_can_see_posts")]
        public bool? UserCanSeePosts { get; set; }
        
        [JsonPropertyName("discussion_subentry_count")]
        public uint? DiscussionSubentryCount { get; set; }
        
        [JsonPropertyName("read_state")]
        public string ReadState { get; set; }
        
        [JsonPropertyName("unread_count")]
        public uint? UnreadCount { get; set; }
        
        [JsonPropertyName("subscribed")]
        public bool? Subscribed { get; set; }
        
        [JsonPropertyName("subscription_hold")]
        public string SubscriptionHold { get; set; }
        
        [JsonPropertyName("assignment_id")]
        public int AssignmentId { get; set; }
        
        [JsonPropertyName("delayed_post_at")]
        public DateTime? DelayedPostAt { get; set; }
        
        [JsonPropertyName("published")]
        public bool? Published { get; set; }
        
        [JsonPropertyName("lock_at")]
        public DateTime? LockAt { get; set; }
        
        [JsonPropertyName("locked")]
        public bool? Locked { get; set; }
        
        [JsonPropertyName("pinned")]
        public bool? Pinned { get; set; }
        
        [JsonPropertyName("locked_for_user")]
        public bool? LockedForUser { get; set; }
        
        [JsonPropertyName("lock_info")]
        public object LockInfo { get; set; }
        
        [JsonPropertyName("lock_explanation")]
        public string LockExplanation { get; set; }
        
        [JsonPropertyName("user_name")]
        public string UserName { get; set; }
        
        [JsonPropertyName("topic_children")]
        public IEnumerable<uint> TopicChildren { get; set; }
        
        [JsonPropertyName("group_topic_children")]
        public object GroupTopicChildren { get; set; }
        
        [JsonPropertyName("root_topic_id")]
        public ulong? RootTopicId { get; set; }
        
        [JsonPropertyName("podcast_url")]
        public string PodcastUrl { get; set; }
        
        [JsonPropertyName("discussion_type")]
        public string DiscussionType { get; set; }
        
        [JsonPropertyName("group_category_id")]
        public ulong? GroupCategoryId { get; set; }
        
        [JsonPropertyName("attachments")]
        public IEnumerable<FileAttachmentModel> Attachments { get; set; }
        
        [JsonPropertyName("permissions")]
        public Dictionary<string, bool> Permissions { get; set; }
        
        [JsonPropertyName("allow_rating")]
        public bool? AllowRating { get; set; }
        
        [JsonPropertyName("only_graders_can_rate")]
        public bool? OnlyGradersCanRate { get; set; }
        
        [JsonPropertyName("sort_by_rating")]
        public bool? SortByRating { get; set; }
        
        [JsonPropertyName("author")]
        public UserDisplayModel Author { get; set; }
    }
}