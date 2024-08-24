using LocalModels;

public class MatchingTests
{
  [Fact]
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

  [Fact]
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
  
  [Fact]
  public void WhitespaceIsOptional()
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

^statement - a single command to be executed
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    quiz.Questions.First().Answers.First().Text.Should().Be("statement");
  }
  [Fact]
  public void CanHaveDistractors()
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

^statement - a single command to be executed
^ - this is the distractor
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    quiz.Questions.First().MatchDistractors.Should().BeEquivalentTo(["this is the distractor"]);
  }
  [Fact]
  public void CanHaveDistractorsAndBePersisted()
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
^ - this is the distractor
";

    var quiz = LocalQuiz.ParseMarkdown(rawMarkdownQuiz);
    var quizMarkdown = quiz.ToMarkdown();

    quizMarkdown.Should().Contain("^ statement - a single command to be executed\n^ - this is the distractor");
  }
}
