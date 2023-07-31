using LocalModels;

public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public string Id { get; set; } = "";
  public string Label { get; set; } = "";
  public int Points { get; set; } = 0;
}

public enum SubmissionType
{
  online_text_entry,
  online_upload,
  online_quiz,
  on_paper,
  discussion_topic,
  external_tool,
  online_url,
  media_recording,
  student_annotation,
  none,
}

public record LocalAssignment
{
  public string id { get; init; } = "";
  public ulong? canvasId = null;
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
  public IEnumerable<SubmissionType> submission_types { get; init; } = new SubmissionType[] { };

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
