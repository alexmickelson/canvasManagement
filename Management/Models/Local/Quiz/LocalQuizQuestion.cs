using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace LocalModels;

public record LocalQuizQuestion
{
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

      // var textWithSpecificNewline = answer.Text.Replace(Environment.NewLine, Environment.NewLine + "   ");

      var multilineMarkdownCompatibleText = answer.Text.StartsWith("```")
        ? Environment.NewLine + answer.Text 
        : answer.Text;
      return $"{questionTypeIndicator}{multilineMarkdownCompatibleText}";
    });
    var answersText = string.Join(Environment.NewLine, answerArray);
    var questionTypeIndicator = QuestionType == "essay" || QuestionType == "short_answer" ? QuestionType : "";

    return $@"Points: {Points}
{Text}
{answersText}{questionTypeIndicator}";
  }

  private static readonly string[] validFirstAnswerDelimiters = new string[] { "*a)", "a)", "[ ]", "[*]" };

  public static LocalQuizQuestion ParseMarkdown(string input, int questionIndex)
  {
    var lines = input.Trim().Split(Environment.NewLine);
    var firstLineIsPoints = lines.First().Contains("points: ", StringComparison.CurrentCultureIgnoreCase);

    var textHasPoints = lines.Length > 0
      && lines.First().Contains(": ")
      && lines.First().Split(": ").Length > 1
      && int.TryParse(lines.First().Split(": ")[1], out _);

    int points = firstLineIsPoints && textHasPoints ? int.Parse(lines.First().Split(": ")[1]) : 1;

    var linesWithoutPoints = firstLineIsPoints ? lines[1..] : lines;

    var linesWithoutAnswers = linesWithoutPoints
      .TakeWhile(
        (line, index) =>
          !validFirstAnswerDelimiters.Any(prefix => line.TrimStart().StartsWith(prefix))
      )
      .ToArray();


    var questionType = getQuestionType(linesWithoutPoints, questionIndex);

    var questionTypesWithoutAnswers = new string[] { "essay", "short answer", "short_answer" };
    var descriptionLines = questionTypesWithoutAnswers.Contains(questionType.ToLower())
      ? linesWithoutAnswers
        .TakeWhile(
          (line, index) => index != linesWithoutPoints.Length && !questionTypesWithoutAnswers.Contains(line.ToLower())
        )
        .ToArray()
      : linesWithoutAnswers;
    var description = string.Join(Environment.NewLine, descriptionLines);



    var typesWithAnswers = new string[] { "multiple_choice", "multiple_answers" };
    var answers = typesWithAnswers.Contains(questionType)
      ? getAnswers(linesWithoutPoints, questionIndex)
      : [];

    return new LocalQuizQuestion()
    {
      Text = description,
      Points = points,
      Answers = answers,
      QuestionType = questionType
    };
  }

  private static string getQuestionType(string[] linesWithoutPoints, int questionIndex)
  {

    if (linesWithoutPoints.Length == 0)
      return "";
    if (linesWithoutPoints[^1].Equals("essay", StringComparison.CurrentCultureIgnoreCase))
      return "essay";
    if (linesWithoutPoints[^1].Equals("short answer", StringComparison.CurrentCultureIgnoreCase))
      return "short_answer";
    if (linesWithoutPoints[^1].Equals("short_answer", StringComparison.CurrentCultureIgnoreCase))
      return "short_answer";

    var answerLines = getAnswersGroupedByLines(linesWithoutPoints, questionIndex);
    var isMultipleChoice =
      answerLines.First().StartsWith("a)")
      || answerLines.First().StartsWith("*a)");
    if (isMultipleChoice)
      return "multiple_choice";

    var isMultipleAnswer =
      answerLines.First().StartsWith("[ ]")
      || answerLines.First().StartsWith("[*]");

    if (isMultipleAnswer)
      return "multiple_answers";

    return "";
  }

  private static List<string> getAnswersGroupedByLines(string[] linesWithoutPoints, int questionIndex)
  {
    var indexOfAnswerStart = linesWithoutPoints
      .ToList()
      .FindIndex(
        l => validFirstAnswerDelimiters.Any(prefix => l.TrimStart().StartsWith(prefix))
      );
    if (indexOfAnswerStart == -1)
    {
      var debugLine = linesWithoutPoints.FirstOrDefault(l => l.Trim().Length > 0);
      throw new QuizMarkdownParseException($"question {questionIndex + 1}: no answers when detecting question type on {debugLine}");
    }

    var answerLinesRaw = linesWithoutPoints[indexOfAnswerStart..];

    var answerStartPattern = @"^(\*?[a-z]\))|\[\s*\]|\[\*\]";
    var answerLines = answerLinesRaw.Aggregate(new List<string>(), (acc, line) =>
    {
      var isNewAnswer = Regex.IsMatch(line, answerStartPattern);
      if (isNewAnswer)
      {
        acc.Add(line);
        return acc;
      }

      if (acc.Count != 0) // Append to the previous line if there is one
        acc[^1] += Environment.NewLine + line;
      else
        acc.Add(line);

      return acc;
    });
    return answerLines;
  }

  private static LocalQuizQuestionAnswer[] getAnswers(string[] linesWithoutPoints, int questionIndex)
  {
    var answerLines = getAnswersGroupedByLines(linesWithoutPoints, questionIndex);

    var answers = answerLines
      .Select((a, i) => LocalQuizQuestionAnswer.ParseMarkdown(a))
      .ToArray();

    return answers;
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