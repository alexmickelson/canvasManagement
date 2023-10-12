using LocalModels;

// try to follow syntax from https://github.com/gpoore/text2qti
public class QuizMarkdownTests
{
  [Test]
  public void CanSerializeQuizToMarkdown()
  {
    var quiz = new LocalQuiz()
    {
      Id = "string",
      Name = "Test Quiz",
      Description = @"
# quiz description

this is my description in markdown

`here is code`
",
      LockAtDueDate = true,
      LockAt = DateTime.MaxValue,
      DueAt = DateTime.MaxValue,
      ShuffleAnswers = true,
      OneQuestionAtATime = false,
      LocalAssignmentGroupName = "someId",
      AllowedAttempts = -1,
      Questions = new LocalQuizQuestion[] { }
    };

    var markdown = quiz.ToMarkdown();

    markdown.Should().Contain("Id: string");
    markdown.Should().Contain("Name: Test Quiz");
    markdown.Should().Contain(quiz.Description);
    markdown.Should().Contain("LockAtDueDate: true");
    markdown.Should().Contain("ShuffleAnswers: true");
    markdown.Should().Contain("OneQuestionAtATime: false");
    markdown.Should().Contain("AssignmentGroup: someId");
    markdown.Should().Contain("AllowedAttempts: -1");
  }
  [Test]
  public void QuzMarkdownIncludesMultipleChoiceQuestion()
  {
    var quiz = new LocalQuiz()
    {
      Id = "string",
      Name = "Test Quiz",
      Description = "desc",
      LockAtDueDate = true,
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
          Id = "someid",
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
      Id = "string",
      Name = "Test Quiz",
      Description = "desc",
      LockAtDueDate = true,
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
          Id = "somesdid",
          Text = "oneline question",
          Points = 1,
          QuestionType = QuestionType.MULTIPLE_ANSWERS,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new LocalQuizQuestionAnswer() { Correct = true, Text = "true" },
            new LocalQuizQuestionAnswer() { Correct = true, Text = "false"},
            new LocalQuizQuestionAnswer() { Correct = false, Text = "neither"},
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
  public void TestCanParseMarkdownQuizWithNoQuestions()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
LockAtDueDate: true
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
";
    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);

    quiz.Name.Should().Be("Test Quiz");
    quiz.LockAtDueDate.Should().Be(true);
    quiz.ShuffleAnswers.Should().Be(true);
    quiz.OneQuestionAtATime.Should().BeFalse();
    quiz.AllowedAttempts.Should().Be(-1);
    quiz.Description.Should().Be(@"this is the 
multi line
description");
  }

  [Test]
  public void TestCanParseQuizWithQuestions()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
LockAtDueDate: true
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

  [Test]
  public void CanParseQuestionWithMultipleAnswers()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
LockAtDueDate: true
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
  public void CanParseMultipleQuestions()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
LockAtDueDate: true
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
  [Test]
  public void CanParseEssay()
  {
    var rawMarkdownQuiz = @"
Name: Test Quiz
LockAtDueDate: true
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
LockAtDueDate: true
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
}