using CanvasModel.Enrollments;

namespace CanvasModel.Users;
public record UserModel
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("name")]
  string Name,

  [property: JsonPropertyName("sortable_name")]
  string SortableName,

  [property: JsonPropertyName("short_name")]
  string ShortName,

  [property: JsonPropertyName("sis_user_id")]
  string SisUserId,

  [property: JsonPropertyName("integration_id")]
  string IntegrationId,

  [property: JsonPropertyName("login_id")]
  string LoginId,

  [property: JsonPropertyName("avatar_url")]
  string AvatarUrl,

  [property: JsonPropertyName("enrollments")]
  List<EnrollmentModel> Enrollments,

  [property: JsonPropertyName("email")]
  string Email,

  [property: JsonPropertyName("locale")]
  string Locale,

  [property: JsonPropertyName("effective_locale")]
  string EffectiveLocale,

  [property: JsonPropertyName("time_zone")]
  string TimeZone,

  [property: JsonPropertyName("bio")]
  string Bio,

  [property: JsonPropertyName("permissions")]
  Dictionary<string, bool> Permissions,

  [property: JsonPropertyName("sis_import_id")]
  ulong? SisImportId = null,

  [property: JsonPropertyName("last_login")]
  DateTime? LastLogin = null
);
