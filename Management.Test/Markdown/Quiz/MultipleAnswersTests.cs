using LocalModels;

public class MultipleAnswersTests
{

  [Test]
  public void QuzMarkdownIncludesMultipleAnswerQuestion()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "desc",
      LockAt = DateTime.MaxValue,
      DueAt = DateTime.MaxValue,
      ShuffleAnswers = true,
      OneQuestionAtATime = false,
      LocalAssignmentGroupName = "someId",
      AllowedAttempts = -1,
      Questions = new LocalQuizQuestion[]
      {
        new()
        {
          Text = "oneline question",
          Points = 1,
          QuestionType = QuestionType.MULTIPLE_ANSWERS,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new() { Correct = true, Text = "true" },
            new() { Correct = true, Text = "false"},
            new() { Correct = false, Text = "neither"},
          }
        }
      }
    };
    var markdown = quiz.ToMarkdown();
    var expectedQuestionString = @"
Points: 1
oneline question
[*] true
[*] false
[ ] neither
";
    markdown.Should().Contain(expectedQuestionString);
  }

  [Test]
  public void CanParseQuestionWithMultipleAnswers()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 2023-08-21T23:59:00
LockAt: 2023-08-21T23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: this is the
multi line
description
---
Which events are triggered when the user clicks on an input field?
[*] click
[*] focus
[*] mousedown
[] submit
[] change
[] mouseout
[] keydown
---
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.Points.Should().Be(1);
    firstQuestion.QuestionType.Should().Be(QuestionType.MULTIPLE_ANSWERS);
    firstQuestion.Text.Should().Contain("Which events are triggered when the user clicks on an input field?");
    firstQuestion.Answers.First().Text.Should().Be("click");
    firstQuestion.Answers.First().Correct.Should().BeTrue();
    firstQuestion.Answers.ElementAt(3).Correct.Should().BeFalse();
    firstQuestion.Answers.ElementAt(3).Text.Should().Be("submit");
  }


  [Test]
  public void CanUseBracesInAnswerFormultipleAnswer()
  {
    var rawMarkdownQuestion = @"
Which events are triggered when the user clicks on an input field?
[*] `int[] theThing()`
[] keydown
";

    var question = LocalQuizQuestion.ParseMarkdown(rawMarkdownQuestion, 0);
    question.Answers.First().Text.Should().Be("`int[] theThing()`");
    question.Answers.Count().Should().Be(2);
  }
  
  [Test]
  public void CanUseBracesInAnswerFormultipleAnswer_MultiLine()
  {
    var rawMarkdownQuestion = @"
Which events are triggered when the user clicks on an input field?
[*]
```
int[] myNumbers = new int[] { };
DoSomething(ref myNumbers);
static void DoSomething(ref int[] numbers)
{
  // do something
}
```
";

    var question = LocalQuizQuestion.ParseMarkdown(rawMarkdownQuestion, 0);
    question.Answers.First().Text.Should().Be(@"```
int[] myNumbers = new int[] { };
DoSomething(ref myNumbers);
static void DoSomething(ref int[] numbers)
{
  // do something
}
```");
    question.Answers.Count().Should().Be(1);
  }
}
