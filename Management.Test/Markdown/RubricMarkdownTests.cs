using LocalModels;

public class RubricMarkdownTests
{

  [Test]
  public void TestCanParseOneItem()
  {
    var rawRubric = @"
    - 2pts: this is the task
    ";

    var rubric = LocalAssignment.ParseRubricMarkdown(rawRubric);
    rubric.Count().Should().Be(1);
    rubric.First().IsExtraCredit.Should().BeFalse();
    rubric.First().Label.Should().Be("this is the task");
    rubric.First().Points.Should().Be(2);
  }

  [Test]
  public void TestCanParseMultipleItems()
  {
    var rawRubric = @"
    - 2pts: this is the task
    - 3pts: this is the other task
    ";

    var rubric = LocalAssignment.ParseRubricMarkdown(rawRubric);
    rubric.Count().Should().Be(2);
    rubric.ElementAt(1).IsExtraCredit.Should().BeFalse();
    rubric.ElementAt(1).Label.Should().Be("this is the other task");
    rubric.ElementAt(1).Points.Should().Be(3);
  }

  [Test]
  public void TestCanParseSinglePoint()
  {
    var rawRubric = @"
    - 1pt: this is the task
    ";

    var rubric = LocalAssignment.ParseRubricMarkdown(rawRubric);
    rubric.First().IsExtraCredit.Should().BeFalse();
    rubric.First().Label.Should().Be("this is the task");
    rubric.First().Points.Should().Be(1);
  }

  [Test]
  public void TestCanParseSingleExtraCredit_LowerCase()
  {
    var rawRubric = @"
    - 1pt: (extra credit) this is the task
    ";

    var rubric = LocalAssignment.ParseRubricMarkdown(rawRubric);
    rubric.First().IsExtraCredit.Should().BeTrue();
    rubric.First().Label.Should().Be("(extra credit) this is the task");
  }

  [Test]
  public void TestCanParseSingleExtraCredit_UpperCase()
  {
    var rawRubric = @"
    - 1pt: (Extra Credit) this is the task
    ";

    var rubric = LocalAssignment.ParseRubricMarkdown(rawRubric);
    rubric.First().IsExtraCredit.Should().BeTrue();
    rubric.First().Label.Should().Be("(Extra Credit) this is the task");
  }
}
