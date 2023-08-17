using RestSharp;

public class WebRequestor : IWebRequestor
{
  private string BaseUrl = Environment.GetEnvironmentVariable("CANVAS_URL") + "/api/v1/";
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
    return (deserialize<T[]>(response), response);
  }

  public async Task<(T?, RestResponse)> GetAsync<T>(RestRequest request)
  {
    var response = await client.ExecuteGetAsync(request);
    return (deserialize<T>(response), response);
  }

  public async Task<RestResponse> PostAsync(RestRequest request)
  {
    var response = await client.ExecutePostAsync(request);
    if (!response.IsSuccessful)
    {
      Console.WriteLine(response.Content);
      Console.WriteLine(response.ResponseUri);
      Console.WriteLine("error with response");
      throw new Exception("error with response");
    }
    return response;
  }

  public async Task<(T?, RestResponse)> PostAsync<T>(RestRequest request)
  {
    var response = await client.ExecutePostAsync(request);
    return (deserialize<T>(response), response);
  }

  public async Task<RestResponse> PutAsync(RestRequest request)
  {
    request.AddHeader("Content-Type", "application/json");
    var response = await client.ExecutePutAsync(request);
    // if (!response.IsSuccessful)
    // {
    //   Console.WriteLine(response.Content);
    //   Console.WriteLine(response.ResponseUri);
    //   Console.WriteLine("error with response");
    //   throw new Exception("error with response");
    // }
    return response;
  }

  public async Task<(T?, RestResponse)> PutAsync<T>(RestRequest request)
  {
    request.AddHeader("Content-Type", "application/json");
    var response = await client.ExecutePutAsync(request);
    return (deserialize<T>(response), response);
  }

  public async Task<RestResponse> DeleteAsync(RestRequest request)
  {
    return await client.DeleteAsync(request);
  }

  private static T? deserialize<T>(RestResponse response)
  {
    if (!response.IsSuccessful)
    {
      Console.WriteLine(response.Content);
      Console.WriteLine(response.ResponseUri);
      Console.WriteLine(response.ErrorMessage);
      Console.WriteLine("error with response");
      // Console.WriteLine(JsonSerializer.Serialize(response));
      Console.WriteLine(JsonSerializer.Serialize(response.Request?.Parameters));
      throw new Exception($"error with response to {response.ResponseUri} {response.StatusCode}");
    }
    try
    {
      var data = JsonSerializer.Deserialize<T>(response.Content!);

      if (data == null)
      {
        Console.WriteLine(response.Content);
        Console.WriteLine(response.ResponseUri);
        Console.WriteLine("could not parse response, got empty object");
      }
      return data;
    }
    catch (NotSupportedException)
    {
      Console.WriteLine(response.Content);
      throw;
    }
    catch (JsonException)
    {
      Console.WriteLine(response.ResponseUri);
      Console.WriteLine(response.Content);
      Console.WriteLine($"An error occurred during deserialization");
      throw;
    }
  }
}
