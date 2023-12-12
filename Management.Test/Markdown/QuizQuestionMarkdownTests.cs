using LocalModels;

public class QuizQuestionMarkdownTests
{
  [Test]
  public void QuzMarkdownIncludesMultipleChoiceQuestion()
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
        new LocalQuizQuestion()
        {
          Points = 2,
          Text = @"`some type` of question

with many 

```
lines
```
",
          QuestionType = QuestionType.MULTIPLE_CHOICE,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new LocalQuizQuestionAnswer() { Correct = true, Text = "true" },
            new LocalQuizQuestionAnswer() { Correct = false, Text = "false" + Environment.NewLine +Environment.NewLine + "endline" },
          }
        }
      }
    };

    var markdown = quiz.ToMarkdown();
    var expectedQuestionString = @"
Points: 2
`some type` of question

with many 

```
lines
```

*a) true
b) false

endline
";
    markdown.Should().Contain(expectedQuestionString);
  }

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

  [Test]
  public void CanParseMatchingQuestion()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 2023-08-21T23:59:00
LockAt: 2023-08-21T23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var firstQuestion = quiz.Questions.First();
    firstQuestion.QuestionType.Should().Be(QuestionType.MATCHING);
    firstQuestion.Text.Should().NotContain("statement");
    firstQuestion.Answers.First().MatchedText.Should().Be("a single command to be executed");
  }
  [Test]
  public void CanCreateMarkdownForMatchingQuesiton()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
ShuffleAnswers: true
OneQuestionAtATime: false
DueAt: 2023-08-21T23:59:00
LockAt: 2023-08-21T23:59:00
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: 
---
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var questionMarkdown = quiz.Questions.First().ToMarkdown();
    var expectedMarkdown = @"Points: 1
Match the following terms & definitions

^ statement - a single command to be executed
^ identifier - name of a variable
^ keyword - reserved word that has special meaning in a program (e.g. class, void, static, etc.)";
    questionMarkdown.Should().Contain(expectedMarkdown);
  }
}