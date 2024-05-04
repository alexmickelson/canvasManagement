using System.Text;
using LocalModels;

// try to follow syntax from https://github.com/gpoore/text2qti
public class QuizMarkdownTests
{
  [Fact]
  public void CanSerializeQuizToMarkdown()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = @"
# quiz description

this is my description in markdown

`here is code`
",
      LockAt = DateTime.MaxValue,
      DueAt = DateTime.MaxValue,
      ShuffleAnswers = true,
      OneQuestionAtATime = false,
      LocalAssignmentGroupName = "someId",
      AllowedAttempts = -1,
      Questions = []
    };

    var markdown = quiz.ToMarkdown();

    markdown.Should().Contain("Name: Test Quiz");
    markdown.Should().Contain(quiz.Description);
    markdown.Should().Contain("ShuffleAnswers: true");
    markdown.Should().Contain("OneQuestionAtATime: false");
    markdown.Should().Contain("AssignmentGroup: someId");
    markdown.Should().Contain("AllowedAttempts: -1");
  }


  [Fact]
  public void TestCanParseMarkdownQuizWithNoQuestions()
  {
    var rawMarkdownQuiz = new StringBuilder();
    rawMarkdownQuiz.Append("Name: Test Quiz\n");
    rawMarkdownQuiz.Append("ShuffleAnswers: true\n");
    rawMarkdownQuiz.Append("OneQuestionAtATime: false\n");
    rawMarkdownQuiz.Append("DueAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("LockAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("AssignmentGroup: Assignments\n");
    rawMarkdownQuiz.Append("AllowedAttempts: -1\n");
    rawMarkdownQuiz.Append("Description: this is the\n");
    rawMarkdownQuiz.Append("multi line\n");
    rawMarkdownQuiz.Append("description\n");
    rawMarkdownQuiz.Append("---\n");
    rawMarkdownQuiz.Append('\n');

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz.ToString());


    var expectedDescription = new StringBuilder();
    expectedDescription.Append("this is the\n");
    expectedDescription.Append("multi line\n");
    expectedDescription.Append("description");

    quiz.Name.Should().Be("Test Quiz");
    quiz.ShuffleAnswers.Should().Be(true);
    quiz.OneQuestionAtATime.Should().BeFalse();
    quiz.AllowedAttempts.Should().Be(-1);
    quiz.Description.Should().Be(expectedDescription.ToString());
  }
  [Fact]
  public void TestCanParseMarkdownQuizPassword()
  {

    var password = "this-is-the-password";
    var rawMarkdownQuiz = new StringBuilder();
    rawMarkdownQuiz.Append("Name: Test Quiz\n");
    rawMarkdownQuiz.Append($"Password: {password}\n");
    rawMarkdownQuiz.Append("ShuffleAnswers: true\n");
    rawMarkdownQuiz.Append("OneQuestionAtATime: false\n");
    rawMarkdownQuiz.Append("DueAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("LockAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("AssignmentGroup: Assignments\n");
    rawMarkdownQuiz.Append("AllowedAttempts: -1\n");
    rawMarkdownQuiz.Append("Description: this is the\n");
    rawMarkdownQuiz.Append("multi line\n");
    rawMarkdownQuiz.Append("description\n");
    rawMarkdownQuiz.Append("---\n");
    rawMarkdownQuiz.Append('\n');

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz.ToString());


    quiz.Password.Should().Be(password);
  }

  [Fact]
  public void TestCanParseMarkdownQuiz_CanConfigureToShowCorrectAnswers()
  {
    var rawMarkdownQuiz = new StringBuilder();
    rawMarkdownQuiz.Append("Name: Test Quiz\n");
    rawMarkdownQuiz.Append("ShuffleAnswers: true\n");
    rawMarkdownQuiz.Append("OneQuestionAtATime: false\n");
    rawMarkdownQuiz.Append("ShowCorrectAnswers: false\n");
    rawMarkdownQuiz.Append("DueAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("LockAt: 2023-08-21T23:59:00\n");
    rawMarkdownQuiz.Append("AssignmentGroup: Assignments\n");
    rawMarkdownQuiz.Append("AllowedAttempts: -1\n");
    rawMarkdownQuiz.Append("Description: this is the\n");
    rawMarkdownQuiz.Append("multi line\n");
    rawMarkdownQuiz.Append("description\n");
    rawMarkdownQuiz.Append("---\n");
    rawMarkdownQuiz.Append('\n');

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz.ToString());


    quiz.showCorrectAnswers.Should().BeFalse();
  }

  [Fact]
  public void TestCanParseQuizWithQuestions()
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
Points: 2
`some type` of question

with many

```
lines
```

*a) true
b) false

   endline";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.QuestionType.Should().Be(QuestionType.MULTIPLE_CHOICE);
    firstQuestion.Points.Should().Be(2);
    firstQuestion.Text.Should().Contain("```");
    firstQuestion.Text.Should().Contain("`some type` of question");
    firstQuestion.Answers.First().Text.Should().Be("true");
    firstQuestion.Answers.First().Correct.Should().BeTrue();
    firstQuestion.Answers.ElementAt(1).Correct.Should().BeFalse();
    firstQuestion.Answers.ElementAt(1).Text.Should().Contain("endline");
  }

  [Fact]
  public void CanParseMultipleQuestions()
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
---
points: 2
`some type` of question
*a) true
b) false
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.Points.Should().Be(1);
    firstQuestion.QuestionType.Should().Be(QuestionType.MULTIPLE_ANSWERS);
    var secondQuestion = quiz.Questions.ElementAt(1);
    secondQuestion.Points.Should().Be(2);
    secondQuestion.QuestionType.Should().Be(QuestionType.MULTIPLE_CHOICE);
  }

  [Fact]
  public void ShortAnswerToMarkdown_IsCorrect()
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
short answer
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();

    var questionMarkdown = firstQuestion.ToMarkdown();
    var expectedMarkdown = @"Points: 1
Which events are triggered when the user clicks on an input field?
short_answer";
    questionMarkdown.Should().Contain(expectedMarkdown);
  }
  [Fact]
  public void NegativePoints_IsAllowed()
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
Points: -4
Which events are triggered when the user clicks on an input field?
short answer
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.Points.Should().Be(-4);
  }
  [Fact]
  public void FloatingPointPoints_IsAllowed()
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
Points: 4.56
Which events are triggered when the user clicks on an input field?
short answer
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.Points.Should().Be(4.56);
  }
}
