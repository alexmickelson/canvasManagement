

using Model.Assignments;
using Model.Quizzes;

namespace Model.ToDos {
    
    
    public class ToDoItemModel {
        
        [JsonPropertyName("context_type")]
        public string ContextType { get; set; }
        
        [JsonPropertyName("course_id")]
        public ulong? CourseId { get; set; }
        
        [JsonPropertyName("group_id")]
        public ulong? GroupId { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("ignore")]
        public string IgnoreUrl { get; set; }
        
        [JsonPropertyName("ignore_permanently")]
        public string PermanentIgnoreUrl { get; set; }
        
        [JsonPropertyName("assignment")]
        public AssignmentModel? Assignment { get; set; }
        
        [JsonPropertyName("quiz")]
        public QuizModel? Quiz { get; set; }
        
        
    }
}
