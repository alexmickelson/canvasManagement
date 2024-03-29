using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace LocalModels;

public record LocalQuizQuestion
{
  public string Text { get; init; } = string.Empty;
  public string HtmlText => MarkdownService.Render(Text);
  public string QuestionType { get; init; } = string.Empty;
  public double Points { get; init; }
  public IEnumerable<LocalQuizQuestionAnswer> Answers { get; init; } =
    Enumerable.Empty<LocalQuizQuestionAnswer>();
  public string ToMarkdown()
  {
    var answerArray = Answers.Select(getAnswerMarkdown);
    var answersText = string.Join("\n", answerArray);
    var questionTypeIndicator = QuestionType == "essay" || QuestionType == "short_answer" ? QuestionType : "";

    return $@"Points: {Points}
{Text}
{answersText}{questionTypeIndicator}";
  }

  private string getAnswerMarkdown(LocalQuizQuestionAnswer answer, int index)
  {
    var multilineMarkdownCompatibleText = answer.Text.StartsWith("```")
      ? "\n" + answer.Text
      : answer.Text;

    if (QuestionType == "multiple_answers")
    {
      var correctIndicator = answer.Correct ? "*" : " ";
      var questionTypeIndicator = $"[{correctIndicator}] ";

      return $"{questionTypeIndicator}{multilineMarkdownCompatibleText}";
    }
    else if (QuestionType == "matching")
    {
      return $"^ {answer.Text} - {answer.MatchedText}";
    }
    else
    {
      var questionLetter = (char)(index + 97);
      var correctIndicator = answer.Correct ? "*" : "";
      var questionTypeIndicator = $"{correctIndicator}{questionLetter}) ";

      return $"{questionTypeIndicator}{multilineMarkdownCompatibleText}";
    }
  }

  private static readonly string[] _validFirstAnswerDelimiters = ["*a)", "a)", "*)", ")", "[ ]", "[*]", "^"];

  public static LocalQuizQuestion ParseMarkdown(string input, int questionIndex)
  {
    var lines = input.Trim().Split("\n");
    var firstLineIsPoints = lines.First().Contains("points: ", StringComparison.CurrentCultureIgnoreCase);

    var textHasPoints = lines.Length > 0
      && lines.First().Contains(": ")
      && lines.First().Split(": ").Length > 1
      && double.TryParse(lines.First().Split(": ")[1], out _);

    double points = firstLineIsPoints && textHasPoints ? double.Parse(lines.First().Split(": ")[1]) : 1;

    var linesWithoutPoints = firstLineIsPoints ? lines[1..] : lines;

    var linesWithoutAnswers = linesWithoutPoints
      .TakeWhile(
        (line, index) =>
          !_validFirstAnswerDelimiters.Any(prefix => line.TrimStart().StartsWith(prefix))
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
    var description = string.Join("\n", descriptionLines);



    var typesWithAnswers = new string[] { "multiple_choice", "multiple_answers", "matching" };
    var answers = typesWithAnswers.Contains(questionType)
      ? getAnswers(linesWithoutPoints, questionIndex, questionType)
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

    var answerLines = getAnswerStringsWithMultilineSupport(linesWithoutPoints, questionIndex);
    var firstAnswerLine = answerLines.First();
    var isMultipleChoice =
      firstAnswerLine.StartsWith("a)")
      || firstAnswerLine.StartsWith("*a)")
      || firstAnswerLine.StartsWith("*)")
      || firstAnswerLine.StartsWith(")");
    if (isMultipleChoice)
      return "multiple_choice";

    var isMultipleAnswer =
      firstAnswerLine.StartsWith("[ ]")
      || firstAnswerLine.StartsWith("[*]");

    if (isMultipleAnswer)
      return "multiple_answers";

    var isMatching = answerLines.First().StartsWith("^");
    if (isMatching)
      return "matching";

    return "";
  }

  private static List<string> getAnswerStringsWithMultilineSupport(string[] linesWithoutPoints, int questionIndex)
  {
    var indexOfAnswerStart = linesWithoutPoints
      .ToList()
      .FindIndex(
        l => _validFirstAnswerDelimiters.Any(prefix => l.TrimStart().StartsWith(prefix))
      );
    if (indexOfAnswerStart == -1)
    {
      var debugLine = linesWithoutPoints.FirstOrDefault(l => l.Trim().Length > 0);
      throw new QuizMarkdownParseException($"question {questionIndex + 1}: no answers when detecting question type on {debugLine}");
    }

    var answerLinesRaw = linesWithoutPoints[indexOfAnswerStart..];

    var answerStartPattern = @"^(\*?[a-z]?\))|\[\s*\]|\[\*\]|\^";
    var answerLines = answerLinesRaw.Aggregate(new List<string>(), (acc, line) =>
    {
      var isNewAnswer = Regex.IsMatch(line, answerStartPattern);
      if (isNewAnswer)
      {
        acc.Add(line);
        return acc;
      }

      if (acc.Count != 0) // Append to the previous line if there is one
        acc[^1] += "\n" + line;
      else
        acc.Add(line);

      return acc;
    });
    return answerLines;
  }

  private static LocalQuizQuestionAnswer[] getAnswers(string[] linesWithoutPoints, int questionIndex, string questionType)
  {
    var answerLines = getAnswerStringsWithMultilineSupport(linesWithoutPoints, questionIndex);

    var answers = answerLines
      .Select((a, i) => LocalQuizQuestionAnswer.ParseMarkdown(a, questionType))
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
  public static readonly string MATCHING = "matching";

  // possible support for: calculated, file_upload, fill_in_multiple_blanks, matching, multiple_dropdowns, numerical,  text_only, true_false,
  public static readonly IEnumerable<string> AllTypes = new string[]
  {
    MULTIPLE_ANSWERS,
    MULTIPLE_CHOICE,
    ESSAY,
    SHORT_ANSWER,
    MATCHING

  };
}
