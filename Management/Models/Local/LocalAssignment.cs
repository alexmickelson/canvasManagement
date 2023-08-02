using LocalModels;

public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public string Id { get; set; } = "";
  public string Label { get; set; } = "";
  public int Points { get; set; } = 0;
}

public static class SubmissionType
{
  public static readonly string online_text_entry = "online_text_entry";
  public static readonly string online_upload = "online_upload";
  public static readonly string online_quiz = "online_quiz";
  public static readonly string on_paper = "on_paper";
  public static readonly string discussion_topic = "discussion_topic";
  public static readonly string external_tool = "external_tool";
  public static readonly string online_url = "online_url";
  public static readonly string media_recording = "media_recording";
  public static readonly string student_annotation = "student_annotation";
  public static readonly string none = "none";
  public static readonly IEnumerable<string> AllTypes = new string[]
  {
    SubmissionType.online_text_entry,
    SubmissionType.online_upload,
    SubmissionType.online_quiz,
    SubmissionType.on_paper,
    SubmissionType.discussion_topic,
    SubmissionType.external_tool,
    SubmissionType.online_url,
    SubmissionType.media_recording,
    SubmissionType.student_annotation,
    SubmissionType.none,
  };
}

public record LocalAssignment
{
  public string id { get; init; } = "";
  public ulong? canvasId { get; init; } = null;
  public string name { get; init; } = "";
  public string description { get; init; } = "";
  public bool use_template { get; init; } = false;
  public string? template_id { get; init; } = string.Empty;
  public Dictionary<string, string> template_variables { get; init; } =
    new Dictionary<string, string>();
  public bool lock_at_due_date { get; init; }
  public IEnumerable<RubricItem> rubric { get; init; } = new RubricItem[] { };
  public DateTime? lock_at { get; init; }
  public DateTime due_at { get; init; }
  public int points_possible { get; init; }
  public IEnumerable<string> submission_types { get; init; } = new string[] { };

  public string GetRubricHtml()
  {
    var output = "<h1>Rubric</h1><pre><code class=\"language-json\">[\n";

    var lineStrings = rubric.Select(
      item => $"  {{\"label\": \"{item.Label}\", \"points\": {item.Points}}}"
    );
    output += string.Join(",\n", lineStrings);
    output += "\n]</code></pre>";
    return output;
  }

  public string GetDescriptionHtml(IEnumerable<AssignmentTemplate>? templates)
  {
    if (use_template && templates == null)
      throw new Exception("cannot get description for assignment if templates not provided");

    var rubricHtml = GetRubricHtml();

    if (use_template)
    {
      var template = templates?.FirstOrDefault(t => t.Id == template_id);
      if (template == null)
        throw new Exception($"Could not find template with id {template_id}");

      var html = Markdig.Markdown.ToHtml(template.Markdown);

      foreach (KeyValuePair<string, string> entry in template_variables)
      {
        html = html.Replace($"%7B%7B{entry.Key}%7D%7D", entry.Value);
      }
      return html + "<hr>" + rubricHtml;
    }

    return Markdig.Markdown.ToHtml(description) + "<hr>" + rubricHtml;
  }
}
