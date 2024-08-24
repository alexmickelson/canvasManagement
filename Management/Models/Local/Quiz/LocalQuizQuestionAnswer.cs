using System.Text.RegularExpressions;

namespace LocalModels;

public record LocalQuizQuestionAnswer
{
  //correct gets a weight of 100 in canvas
  public bool Correct { get; init; }
  public string Text { get; init; } = string.Empty;

  public string? MatchedText { get; init; }

  public string HtmlText => MarkdownService.Render(Text);

  public static LocalQuizQuestionAnswer ParseMarkdown(string input, string questionType)
  {
    var isCorrect = input[0] == '*' || input[1] == '*';

    if (questionType == QuestionType.MATCHING)
    {

      string matchingPattern = @"^\^ ?";
      var textWithoutMatchDelimiter = Regex.Replace(input, matchingPattern, string.Empty).Trim();
      return new LocalQuizQuestionAnswer()
      {
        Correct = true,
        Text = textWithoutMatchDelimiter.Split('-')[0].Trim(),
        MatchedText = string.Join("-", textWithoutMatchDelimiter.Split('-')[1..]).Trim(),
      };
    }

    string startingQuestionPattern = @"^(\*?[a-z]?\))|\[\s*\]|\[\*\]|\^ ";

    int replaceCount = 0;
    var text = Regex
      .Replace(input, startingQuestionPattern, (m) => replaceCount++ == 0 ? "" : m.Value)
      .Trim();
    return new LocalQuizQuestionAnswer()
    {
      Correct = isCorrect,
      Text = text,
    };
  }
}
