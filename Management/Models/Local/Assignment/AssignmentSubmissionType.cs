namespace LocalModels;

public static class AssignmentSubmissionType
{
  public static readonly string ONLINE_TEXT_ENTRY = "online_text_entry";
  public static readonly string ONLINE_UPLOAD = "online_upload";
  public static readonly string ONLINE_QUIZ = "online_quiz";
  // public static readonly string ON_PAPER = "on_paper";
  public static readonly string DISCUSSION_TOPIC = "discussion_topic";
  // public static readonly string EXTERNAL_TOOL = "external_tool";
  public static readonly string ONLINE_URL = "online_url";
  // public static readonly string MEDIA_RECORDING = "media_recording";
  // public static readonly string STUDENT_ANNOTATION = "student_annotation";
  public static readonly string NONE = "none";
  public static readonly IEnumerable<string> AllTypes = new string[]
  {
    ONLINE_TEXT_ENTRY,
    ONLINE_UPLOAD,
    ONLINE_QUIZ,
    // ON_PAPER,
    DISCUSSION_TOPIC,
    // EXTERNAL_TOOL,
    ONLINE_URL,
    // MEDIA_RECORDING,
    // STUDENT_ANNOTATION,
    NONE,
  };
}
