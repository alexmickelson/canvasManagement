using System.Text.RegularExpressions;

namespace LocalModels;

public record LocalQuizQuestion
{
  public string Id { get; set; } = "";
  public string Text { get; init; } = string.Empty;
  public string HtmlText => Markdig.Markdown.ToHtml(Text);
  public string QuestionType { get; init; } = string.Empty;
  public int Points { get; init; }
  public IEnumerable<LocalQuizQuestionAnswer> Answers { get; init; } =
    Enumerable.Empty<LocalQuizQuestionAnswer>();
  public string ToMarkdown()
  {
    var answerArray = Answers.Select((answer, i) =>
    {
      var questionLetter = (char)(i + 97);
      var isMultipleChoice = QuestionType == "multiple_choice";

      var correctIndicator = answer.Correct ? "*" : isMultipleChoice ? "" : " ";


      var questionTypeIndicator = isMultipleChoice
        ? $"{correctIndicator}{questionLetter}) "
        : $"[{correctIndicator}] ";

      var textWithSpecificNewline = answer.Text.Replace(Environment.NewLine, Environment.NewLine + "   ");
      return $"{questionTypeIndicator}{textWithSpecificNewline}";
    });
    var answersText = string.Join(Environment.NewLine, answerArray);

    return $@"Points: {Points}
{Text}
{answersText}";
  }

  private static readonly string[] validFirstAnswerDelimiters = new string[] { "*a)", "a)", "[ ]", "[*]" };
  public static LocalQuizQuestion ParseMarkdown(string input)
  {
    var lines = input.Split(Environment.NewLine);
    var firstLineIsPoints = lines.First().Contains("points: ", StringComparison.CurrentCultureIgnoreCase);
    int points = firstLineIsPoints ? int.Parse(lines.First().Split(": ")[1]) : 1;

    var linesWithoutPoints = firstLineIsPoints ? lines[1..] : lines;

    var linesWithoutAnswers = linesWithoutPoints
      .TakeWhile(line => !validFirstAnswerDelimiters.Any(prefix => line.TrimStart().StartsWith(prefix)))
      .ToArray();
    var description = string.Join(Environment.NewLine, linesWithoutAnswers);


    var (answers, questionType) = getAnswers(linesWithoutPoints);

    return new LocalQuizQuestion()
    {
      Text = description,
      Points = points,
      Answers = answers,
      QuestionType = questionType
    };
  }

  private static (LocalQuizQuestionAnswer[], string questionType) getAnswers(string[] linesWithoutPoints)
  {
    var indexOfAnswerStart = linesWithoutPoints
      .ToList()
      .FindIndex(
        l => validFirstAnswerDelimiters.Any(prefix => l.TrimStart().StartsWith(prefix))
      );
    var answerLinesRaw = linesWithoutPoints[indexOfAnswerStart..];

    var answerStartPattern = @"^(\*?[a-z]\))|\[\s*\]|\[\*\]";
    var answerLines = answerLinesRaw.Aggregate(new List<string>(), (acc, line) =>
    {
      if (!Regex.IsMatch(line, answerStartPattern))
      {
        if (acc.Count != 0) // Append to the previous line if there is one
        {
          int lastIndex = acc.Count - 1;
          acc[lastIndex] += Environment.NewLine + line;
        }
        else
        {
          acc.Add(line);
        }
      }
      else
      {
        acc.Add(line); // Add as a new line if it matches the pattern
      }

      return acc;
    });

    var answers = answerLines.Select(LocalQuizQuestionAnswer.ParseMarkdown).ToArray();

    var isMultipleChoice =
      answerLines.First().StartsWith("a)")
      || answerLines.First().StartsWith("*a)");

    var isMultipleAnswer =
      answerLines.First().StartsWith("[ ]")
      || answerLines.First().StartsWith("[*]");

    var questionType = isMultipleChoice
      ? "multiple_choice"
      : isMultipleAnswer
        ? "multiple_answers"
        : "";

    return (answers, questionType);
  }
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
