using System;


using Model.Users;

namespace Model.Submissions {
    
    public class SubmissionCommentModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("author_id")]
        public ulong AuthorId { get; set; }
        
        [JsonPropertyName("author_name")]
        public string AuthorName { get; set; }
        
        [JsonPropertyName("author")]
        public UserDisplayModel Author { get; set; }
        
        [JsonPropertyName("comment")]
        public string Comment { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("edited_at")]
        public DateTime? EditedAt { get; set; }
        
        [JsonPropertyName("media_comment")]
        public MediaCommentModel? MediaComment { get; set; }
    }
}