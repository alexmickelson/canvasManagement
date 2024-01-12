using LocalModels;

public class PageMarkdownTests
{
  [Test]
  public void TestCanParsePage()
  {
    var page = new LocalCoursePage
    {
      Name = "test title",
      Text = "test text content",
      DueAt = new DateTime()
    };

    var pageMarkdown = page.ToMarkdown();

    var parsedPage = LocalCoursePage.ParseMarkdown(pageMarkdown);

    parsedPage.Should().BeEquivalentTo(page);
  }
}
