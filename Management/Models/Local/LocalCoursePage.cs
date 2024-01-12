namespace LocalModels;

public record LocalCoursePage
{
  public required string Name { get; init; }
  public required string Text { get; set; }
  public DateTime? DueDateForOrdering { get; init; }

  public string ToMarkdown()
  {
    var printableDueDate = DueDateForOrdering.ToString()?.Replace('\u202F', ' ');
    var settingsMarkdown = $"Name: {Name}\n"
      + $"DueDateForOrdering: {printableDueDate}\n"
      + "---\n";
    return settingsMarkdown + Text;
  }
  public static LocalCoursePage ParseMarkdown(string pageMarkdown)
  {
    var rawSettings = pageMarkdown.Split("---")[0];
    var name = MarkdownUtils.ExtractLabelValue(rawSettings, "Name");
    var rawDate = MarkdownUtils.ExtractLabelValue(rawSettings, "DueDateForOrdering");

    DateTime? parsedDate = DateTime.TryParse(rawDate, out DateTime parsedDueAt)
      ? parsedDueAt
      : null;


    var text = pageMarkdown.Split("---\n")[1];

    return new LocalCoursePage
    {
      Name = name,
      DueDateForOrdering = parsedDate,
      Text = text
    };
  }
}


public class LocalPageMarkdownParseException : Exception
{
  public LocalPageMarkdownParseException(string message) : base(message)
  {

  }
}
