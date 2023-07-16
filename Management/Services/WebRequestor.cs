using RestSharp;

public class WebRequestor : IWebRequestor
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private string token;
  private RestClient client;

  public WebRequestor()
  {
    token =
      Environment.GetEnvironmentVariable("CANVAS_TOKEN")
      ?? throw new Exception("CANVAS_TOKEN not in environment");
    client = new RestClient(BaseUrl);
    client.AddDefaultHeader("Authorization", $"Bearer {token}");

  }

  public async Task<RestResponse<T[]>> GetManyAsync<T>(RestRequest request)
  {
    return await client.ExecuteGetAsync<T[]>(request);
  }

  public async Task<RestResponse<T>> GetAsync<T>(RestRequest request)
  {
    return await client.ExecuteGetAsync<T>(request);
  }
}
