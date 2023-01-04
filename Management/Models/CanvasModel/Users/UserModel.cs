using System;
using System.Collections.Generic;


using Model.Enrollments;

namespace Model.Users {
    public class UserModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("sortable_name")]
        public string SortableName { get; set; }
        
        [JsonPropertyName("short_name")]
        public string ShortName { get; set; }
        
        [JsonPropertyName("sis_user_id")]
        public string SisUserId { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public ulong? SisImportId { get; set; }
        
        [JsonPropertyName("integration_id")]
        public string IntegrationId { get; set; }
        
        [JsonPropertyName("login_id")]
        public string LoginId { get; set; }
        
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
        
        [JsonPropertyName("enrollments")]
        public List<EnrollmentModel> Enrollments { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("locale")]
        public string Locale { get; set; }
        
        [JsonPropertyName("effective_locale")]
        public string EffectiveLocale { get; set; }
        
        [JsonPropertyName("last_login")]
        public DateTime? LastLogin { get; set; }
        
        [JsonPropertyName("time_zone")]
        public string TimeZone { get; set; }
        
        [JsonPropertyName("bio")]
        public string Bio { get; set; }
        
        [JsonPropertyName("permissions")]
        public Dictionary<string, bool> Permissions { get; set; }

        
    }
}