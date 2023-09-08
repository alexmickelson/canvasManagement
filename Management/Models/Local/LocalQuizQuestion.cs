namespace LocalModels;

public record LocalQuizQuestion
{
  public ulong? CanvasId { get; set; }
  public string Id { get; set; } = "";
  public string Text { get; init; } = string.Empty;  
  public string HtmlText => Markdig.Markdown.ToHtml(Text);
  public string QuestionType { get; init; } = string.Empty;
  public int Points { get; init; }
  public IEnumerable<LocalQuizQuestionAnswer> Answers { get; init; } =
    Enumerable.Empty<LocalQuizQuestionAnswer>();
}

public static class QuestionType
{
  public static readonly string MULTIPLE_ANSWERS = "multiple_answers";
  public static readonly string MULTIPLE_CHOICE = "multiple_choice";
  public static readonly string ESSAY = "essay";
  public static readonly string SHORT_ANSWER = "short_answer";

  // possible support for: calculated, file_upload, fill_in_multiple_blanks, matching, multiple_dropdowns, numerical,  text_only, true_false,
  public static readonly IEnumerable<string> AllTypes = new string[]
  {
    MULTIPLE_ANSWERS,
    MULTIPLE_CHOICE,
    ESSAY,
    SHORT_ANSWER,
  };
}
