

namespace Model.CustomGradebookColumns {
    
    public struct ColumnDatumModel {
        
        [JsonPropertyName("content")]
        public string Content { get; set; }
        
        [JsonPropertyName("user_id")]
        public ulong UserId { get; set; }
    }
}
