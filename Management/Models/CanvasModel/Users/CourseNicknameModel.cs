


namespace Model.Users {
    public class CourseNicknameModel {
        
        [JsonPropertyName("course_id")]
        public ulong CourseId { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("nickname")]
        public string Nickname { get; set; }

        
    }
}