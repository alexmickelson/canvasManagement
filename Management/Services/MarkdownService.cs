using Markdig;


public static class MarkdownService
{
  public static string Render(string incomingMarkdown)
  {
    var pipeline = new MarkdownPipelineBuilder()
      .UseAdvancedExtensions()
      .Build();
    return Markdown.ToHtml(incomingMarkdown, pipeline);
  }
}
