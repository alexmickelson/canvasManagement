using LocalModels;

// try to follow syntax from https://github.com/gpoore/text2qti
public class QuizMarkdownTests
{
  [Test]
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
      Questions = new LocalQuizQuestion[] { }
    };

    var markdown = quiz.ToMarkdown();

    markdown.Should().Contain("Name: Test Quiz");
    markdown.Should().Contain(quiz.Description);
    markdown.Should().Contain("ShuffleAnswers: true");
    markdown.Should().Contain("OneQuestionAtATime: false");
    markdown.Should().Contain("AssignmentGroup: someId");
    markdown.Should().Contain("AllowedAttempts: -1");
  }


  [Test]
  public void TestCanParseMarkdownQuizWithNoQuestions()
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
";
    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);

    quiz.Name.Should().Be("Test Quiz");
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
  public void SerializationIsDeterministic_EmptyQuiz()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      ShuffleAnswers = true,
      OneQuestionAtATime = true,
      LocalAssignmentGroupName = "Assignments"
    };
    var quizMarkdown = quiz.ToMarkdown();

    var parsedQuiz = LocalQuiz.ParseMarkdown(quizMarkdown);
    parsedQuiz.Should().BeEquivalentTo(quiz);
  }
  [Test]
  public void SerializationIsDeterministic_ShortAnswer()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      ShuffleAnswers = true,
      OneQuestionAtATime = true,
      LocalAssignmentGroupName = "Assignments",
      Questions = new LocalQuizQuestion[]
      {
        new ()
        {
          Text = "test short answer",
          QuestionType = QuestionType.SHORT_ANSWER,
          Points = 1
        }
      }
    };
    var quizMarkdown = quiz.ToMarkdown();

    var parsedQuiz = LocalQuiz.ParseMarkdown(quizMarkdown);
    parsedQuiz.Should().BeEquivalentTo(quiz);
  }

  [Test]
  public void SerializationIsDeterministic_Essay()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      ShuffleAnswers = true,
      OneQuestionAtATime = true,
      LocalAssignmentGroupName = "Assignments",
      Questions = new LocalQuizQuestion[]
      {
        new ()
        {
          Text = "test essay",
          QuestionType = QuestionType.ESSAY,
          Points = 1
        }
      }
    };
    var quizMarkdown = quiz.ToMarkdown();

    var parsedQuiz = LocalQuiz.ParseMarkdown(quizMarkdown);
    parsedQuiz.Should().BeEquivalentTo(quiz);
  }

  [Test]
  public void SerializationIsDeterministic_MultipleAnswer()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      ShuffleAnswers = true,
      OneQuestionAtATime = true,
      LocalAssignmentGroupName = "Assignments",
      Questions = new LocalQuizQuestion[]
      {
        new ()
        {
          Text = "test multiple answer",
          QuestionType = QuestionType.MULTIPLE_ANSWERS,
          Points = 1,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new() {
              Correct = true,
              Text="yes",
            },
            new() {
              Correct = true,
              Text="no",
            }
          }
        }
      }
    };
    var quizMarkdown = quiz.ToMarkdown();

    var parsedQuiz = LocalQuiz.ParseMarkdown(quizMarkdown);
    parsedQuiz.Should().BeEquivalentTo(quiz);
  }

  [Test]
  public void SerializationIsDeterministic_MultipleChoice()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      ShuffleAnswers = true,
      OneQuestionAtATime = true,
      LocalAssignmentGroupName = "Assignments",
      Questions = new LocalQuizQuestion[]
      {
        new ()
        {
          Text = "test multiple choice",
          QuestionType = QuestionType.MULTIPLE_CHOICE,
          Points = 1,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new() {
              Correct = true,
              Text="yes",
            },
            new() {
              Correct = false,
              Text="no",
            }
          }
        }
      }
    };
    var quizMarkdown = quiz.ToMarkdown();

    var parsedQuiz = LocalQuiz.ParseMarkdown(quizMarkdown);
    parsedQuiz.Should().BeEquivalentTo(quiz);
  }
}