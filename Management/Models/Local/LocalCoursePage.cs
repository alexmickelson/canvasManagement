namespace LocalModels;

public record LocalCoursePage : IModuleItem
{
  public required string Name { get; init; }
  public required string Text { get; set; }
  public DateTime DueAt { get; init; }
  public string GetBodyHtml() => Markdig.Markdown.ToHtml(Text);

  public string ToMarkdown()
  {
    var printableDueDate = DueAt.ToString()?.Replace('\u202F', ' ');
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

    DateTime parsedDate = DateTime.TryParse(rawDate, out DateTime parsedDueAt)
      ? parsedDueAt
      : throw new LocalPageMarkdownParseException($"could not parse due date: {rawDate}");


    var text = pageMarkdown.Split("---\n")[1];

    return new LocalCoursePage
    {
      Name = name,
      DueAt = parsedDate,
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
