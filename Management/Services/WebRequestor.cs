using RestSharp;

public class WebRequestor : IWebRequestor
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private bool tokenSet = false;
  private RestClient client;

  private ICanvasTokenManagement tokenManagement { get; }

  public WebRequestor(ICanvasTokenManagement tokenManagement)
  {
    client = new RestClient(BaseUrl);
    this.tokenManagement = tokenManagement;
  }

  private async Task EnsureCanvasTokenSet()
  {
    if (tokenSet)
      return;
    
    var newToken = await tokenManagement.GetCanvasToken();
    if(newToken == null)
      throw new Exception("cannot request canvas, no token in storage");
    
    client.AddDefaultHeader("Authorization", $"Bearer {newToken}");
    tokenSet = true;
  }
  public async Task<(T[]?, RestResponse)> GetManyAsync<T>(RestRequest request)
  {
    await EnsureCanvasTokenSet();
    var response = await client.ExecuteGetAsync(request);
    return (Deserialize<T[]>(response), response);
  }

  public async Task<(T?, RestResponse)> GetAsync<T>(RestRequest request)
  {
    await EnsureCanvasTokenSet();
    var response = await client.ExecuteGetAsync(request);
    return (Deserialize<T>(response), response);
  }

  public async Task<RestResponse> PostAsync(RestRequest request)
  {
    await EnsureCanvasTokenSet();
    var response = await client.ExecutePostAsync(request);
    if (!response.IsSuccessful)
    {
      System.Console.WriteLine(response.Content);
      System.Console.WriteLine(response.ResponseUri);
      System.Console.WriteLine("error with response");
      throw new Exception("error with response");
    }
    return response;
  }

  public async Task<(T?, RestResponse)> PostAsync<T>(RestRequest request)
  {
    await EnsureCanvasTokenSet();
    var response = await client.ExecutePostAsync(request);
    return (Deserialize<T>(response), response);
  }

  public T? Deserialize<T>(RestResponse response)
  {
    if (!response.IsSuccessful)
    {
      System.Console.WriteLine(response.Content);
      System.Console.WriteLine(response.ResponseUri);
      System.Console.WriteLine(response.ErrorMessage);
      System.Console.WriteLine("error with response");
      throw new Exception("error with response");
    }
    try
    {
      var data = JsonSerializer.Deserialize<T>(response.Content!);

      if (data == null)
      {
        System.Console.WriteLine(response.Content);
        System.Console.WriteLine(response.ResponseUri);
        System.Console.WriteLine("could not parse response, got empty object");
      }
      return data;
    }
    catch (JsonException ex)
    {
      System.Console.WriteLine(response.ResponseUri);
      System.Console.WriteLine(response.Content);
      Console.WriteLine($"An error occurred during deserialization: {ex.Message}");
      throw ex;
    }
  }
}
