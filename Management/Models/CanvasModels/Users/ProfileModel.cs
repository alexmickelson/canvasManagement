namespace CanvasModel.Users;

public record ProfileModel
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("name")]
  string Name,

  [property: JsonPropertyName("short_name")]
  string ShortName,

  [property: JsonPropertyName("sortable_name")]
  string SortableName,

  [property: JsonPropertyName("title")]
  string Title,

  [property: JsonPropertyName("bio")]
  string Bio,

  [property: JsonPropertyName("primary_email")]
  string PrimaryEmail,

  [property: JsonPropertyName("login_id")]
  string LoginId,

  [property: JsonPropertyName("sis_user_id")]
  string SisUserId,

  [property: JsonPropertyName("lti_user_id")]
  string LtiUserId,

  [property: JsonPropertyName("avatar_url")]
  string AvatarUrl,

  [property: JsonPropertyName("calendar")]
  object Calendar,

  [property: JsonPropertyName("time_zone")]
  string TimeZone,

  [property: JsonPropertyName("locale")]
  string Locale
);
