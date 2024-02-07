public static class ConfigurationSetup
{
  public static void Canvas(WebApplicationBuilder builder)
  {
    var canvas_token = builder.Configuration["CANVAS_TOKEN"] ?? throw new Exception("CANVAS_TOKEN is null");

    var canvas_url = builder.Configuration["CANVAS_URL"];
    if (canvas_url == null)
    {
      Console.WriteLine("CANVAS_URL is null, defaulting to https://snow.instructure.com");
      builder.Configuration["CANVAS_URL"] = "https://snow.instructure.com";
    }
  }
}
