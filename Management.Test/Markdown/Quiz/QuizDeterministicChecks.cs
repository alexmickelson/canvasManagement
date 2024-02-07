using System.Text;
using LocalModels;

public class QuizDeterministicChecks
{

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
  public void SerializationIsDeterministic_ShowCorrectAnswers()
  {
    var quiz = new LocalQuiz()
    {
      Name = "Test Quiz",
      Description = "quiz description",
      LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
      DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
      showCorrectAnswers = false,
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
  [Test]
  public void SerializationIsDeterministic_Matching()
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
          Text = "test matching",
          QuestionType = QuestionType.MATCHING,
          Points = 1,
          Answers = new LocalQuizQuestionAnswer[]
          {
            new() {
              Correct = true,
              Text="yes",
              MatchedText = "testing yes"
            },
            new() {
              Correct = true,
              Text="no",
              MatchedText = "testing no"
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
