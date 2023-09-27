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
      CanvasId = 8324723,
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
      LocalAssignmentGroupId = "someId",
      AllowedAttempts = -1,
      Questions = new LocalQuizQuestion[] { }
    };

    var markdown = quiz.ToMarkdown();

    markdown.Should().Contain("Id: string");
    markdown.Should().Contain("CanvasId: 8324723");
    markdown.Should().Contain("Name: Test Quiz");
    markdown.Should().Contain(quiz.Description);
    markdown.Should().Contain("LockAtDueDate: true");
    markdown.Should().Contain("ShuffleAnswers: true");
    markdown.Should().Contain("OneQuestionAtATime: false");
    markdown.Should().Contain("LocalAssignmentGroupId: someId");
    markdown.Should().Contain("AllowedAttempts: -1");
  }
  [Test]
  public void QuzMarkdownIncludesMultipleChoiceQuestion()
  {
    var quiz = new LocalQuiz()
    {
      Id = "string",
      CanvasId = 8324723,
      Name = "Test Quiz",
      Description = "desc",
      LockAtDueDate = true,
      LockAt = DateTime.MaxValue,
      DueAt = DateTime.MaxValue,
      ShuffleAnswers = true,
      OneQuestionAtATime = false,
      LocalAssignmentGroupId = "someId",
      AllowedAttempts = -1,
      Questions = new LocalQuizQuestion[]
      {
        new LocalQuizQuestion()
        {
          CanvasId = 32423,
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
            new LocalQuizQuestionAnswer() { CanvasId = 324, Id = "asdfa", Correct = true, Text = "true" },
            new LocalQuizQuestionAnswer() { CanvasId = 32544, Id = "wef", Correct = false, Text = "false" + Environment.NewLine +Environment.NewLine + "endline" },
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
---
";
    markdown.Should().Contain(expectedQuestionString);
  }
//   [Test]
//   public void QuzMarkdownIncludesMultipleAnswerQuestion()
//   {
//     var quiz = new LocalQuiz()
//     {
//       Id = "string",
//       CanvasId = 8324723,
//       Name = "Test Quiz",
//       Description = "desc",
//       LockAtDueDate = true,
//       LockAt = DateTime.MaxValue,
//       DueAt = DateTime.MaxValue,
//       ShuffleAnswers = true,
//       OneQuestionAtATime = false,
//       LocalAssignmentGroupId = "someId",
//       AllowedAttempts = -1,
//       Questions = new LocalQuizQuestion[]
//       {
//         new LocalQuizQuestion()
//         {
//           CanvasId = 32423,
//           Id = "someid",
//           Text = @"
// `some type` of question

// with many 

// ```
// lines
// ```
// ",
//           QuestionType = QuestionType.MULTIPLE_CHOICE,
//           Answers = new LocalQuizQuestionAnswer[]
//           {
//             new LocalQuizQuestionAnswer() { CanvasId = 324, Id = "asdfa", Correct = true, Text = "true" },
//             new LocalQuizQuestionAnswer() { CanvasId = 32544, Id = "wef", Correct = false, Text = "false" + Environment.NewLine +Environment.NewLine + "endline" },
//           }
//         },
//         new LocalQuizQuestion()
//         {
//           CanvasId = 3253,
//           Id = "somesdid",
//           Text = "oneline question",
//           QuestionType = QuestionType.MULTIPLE_ANSWERS,
//           Answers = new LocalQuizQuestionAnswer[]
//           {
//             new LocalQuizQuestionAnswer() { CanvasId = 3324, Id = "asdfsa", Correct = true, Text = "true" },
//             new LocalQuizQuestionAnswer() { CanvasId = 325344, Id = "wsef", Correct = true, Text = "false"},
//           }
//         }
//       }
//     };
//     var markdown = quiz.ToMarkdown();
//   }
}