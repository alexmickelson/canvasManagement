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

  public async Task<(T[]?, RestResponse)> GetManyAsync<T>(RestRequest request)
  {
    var response = await client.ExecuteGetAsync(request);
    return (Deserialize<T[]>(response), response);
  }

  public async Task<(T?, RestResponse)> GetAsync<T>(RestRequest request)
  {
    var response = await client.ExecuteGetAsync(request);
    return (Deserialize<T>(response), response);
  }

  public async Task<RestResponse> PostAsync(RestRequest request)
  {
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
    var response = await client.ExecutePostAsync(request);
    return (Deserialize<T>(response), response);
  }

  public async Task<RestResponse> PutAsync(RestRequest request)
  {
    var response = await client.ExecutePutAsync(request);
    if (!response.IsSuccessful)
    {
      System.Console.WriteLine(response.Content);
      System.Console.WriteLine(response.ResponseUri);
      System.Console.WriteLine("error with response");
      throw new Exception("error with response");
    }
    return response;
  }

  public async Task<(T?, RestResponse)> PutAsync<T>(RestRequest request)
  {
    var response = await client.ExecutePutAsync(request);
    return (Deserialize<T>(response), response);
  }

  private T? Deserialize<T>(RestResponse response)
  {
    if (!response.IsSuccessful)
    {
      System.Console.WriteLine(response.Content);
      System.Console.WriteLine(response.ResponseUri);
      System.Console.WriteLine(response.ErrorMessage);
      System.Console.WriteLine("error with response");
      // Console.WriteLine(JsonSerializer.Serialize(response));
      Console.WriteLine(JsonSerializer.Serialize(response.Request?.Parameters));
      throw new Exception($"error with response to {response.ResponseUri} {response.StatusCode}");
    }
    try
    {
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
      catch (System.NotSupportedException exception)
      {
        Console.WriteLine(response.Content);
        throw exception;
      }
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
