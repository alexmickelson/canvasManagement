public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public string Id { get; set; } = "";
  public string Label { get; set; } = "";
  public int Points { get; set; } = 0;
}

public enum SubmissionType
{
  online_quiz,
  none,
  on_paper,
  discussion_topic,
  external_tool,
  online_upload,
  online_text_entry,
  online_url,
  media_recording,
  student_annotation,
}

public record LocalAssignment
{
  public string id { get; init; } = "";
  public ulong? canvasId = null;
  public string name { get; init; } = "";
  public string description { get; init; } = "";
  public bool lock_at_due_date { get; init; }
  public IEnumerable<RubricItem> rubric { get; init; } = new RubricItem[] { };
  public DateTime? lock_at { get; init; }
  public DateTime due_at { get; init; }
  public int points_possible { get; init; }
  public IEnumerable<SubmissionType> submission_types { get; init; } = new SubmissionType[] { };
}
