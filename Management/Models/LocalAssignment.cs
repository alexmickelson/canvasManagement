public record RubricItem(
  int Points,
  string Label
);

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
  public string name { get; init; } = "";
  public string description { get; init; } = "";
  public bool published { get; init; }
  public bool lock_at_due_date { get; init; }
  public IEnumerable<RubricItem> rubric { get; init; } = new RubricItem[] { };
  public DateTime? lock_at { get; init; }
  public DateTime due_at { get; init; }
  public int points_possible { get; init; }
  public IEnumerable<SubmissionType> submission_types { get; init; } = new SubmissionType[] { };
}