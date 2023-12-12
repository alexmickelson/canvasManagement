using LocalModels;

public class MultipleChoiceTests
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
  public void LetterOptionalForMultipleChoice()
  {

    var questionMarkdown = @"Points: 2
`some type` of question
*) true
) false
   ";
   var question = LocalQuizQuestion.ParseMarkdown(questionMarkdown, 0);
    question.Answers.Count().Should().Be(2);
  }
}