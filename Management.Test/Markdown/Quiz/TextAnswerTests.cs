using LocalModels;

public class TextAnswerTests
{
  [Test]
  public void CanParseEssay()
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
essay
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.Points.Should().Be(1);
    firstQuestion.QuestionType.Should().Be(QuestionType.ESSAY);
    firstQuestion.Text.Should().NotContain("essay");
  }

  [Test]
  public void CanParseShortAnswer()
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
    firstQuestion.Points.Should().Be(1);
    firstQuestion.QuestionType.Should().Be(QuestionType.SHORT_ANSWER);
    firstQuestion.Text.Should().NotContain("short answer");
  }

  [Test]
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

  [Test]
  public void EssayQuestionToMarkdown_IsCorrect()
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
essay
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();

    var questionMarkdown = firstQuestion.ToMarkdown();
    var expectedMarkdown = @"Points: 1
Which events are triggered when the user clicks on an input field?
essay";
    questionMarkdown.Should().Contain(expectedMarkdown);
  }
}
