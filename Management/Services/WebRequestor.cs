using RestSharp;

public class WebRequestor : IWebRequestor
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private string token;
  private RestClient client;
  private string courseid { get; }
  public WebRequestor(RestClient client)
  {
    // token = Environment.GetEnvironmentVariable("CANVAS_TOKEN");
    // client = new RestClient(BaseUrl);
    // client.AddDefaultHeader("Authorization", $"Bearer {token}");

    this.client = client;
    courseid = "774898";
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