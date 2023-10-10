using System.Text.RegularExpressions;

namespace LocalModels;

public record LocalQuizQuestionAnswer
{
  //correct gets a weight of 100 in canvas
  public bool Correct { get; init; }
  public string Text { get; init; } = string.Empty;

  public string HtmlText => Markdig.Markdown.ToHtml(Text);

  public static LocalQuizQuestionAnswer ParseMarkdown(string input)
  {
    var isCorrect = input[0] == '*' || input[1] == '*';
    string startingQuestionPattern = @"^(\*?[a-z]\))|\[\s*\]|\[\*\] ";
    var text = Regex.Replace(input, startingQuestionPattern, string.Empty).Trim();

    return new LocalQuizQuestionAnswer()
    {
      Correct = isCorrect,
      Text=text,
    };
  }
}
