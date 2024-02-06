using System.Net;
using Microsoft.Extensions.Configuration;
using RestSharp;

public class WebRequestor : IWebRequestor
{
  private string BaseUrl = "";
  private string token;
  private RestClient client;
  private readonly IConfiguration _config;
  private readonly ILogger<WebRequestor> logger;

  public WebRequestor(IConfiguration config, ILogger<WebRequestor> logger)
  {
    _config = config;
    this.logger = logger;
    token =
      _config["CANVAS_TOKEN"]
      ?? throw new Exception("CANVAS_TOKEN not in environment");
    BaseUrl = _config["CANVAS_URL"] + "/api/v1/";
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
    using var activity = DiagnosticsConfig.Source.StartActivity("sending post");
    activity?.AddTag("success", false);

    request.AddHeader("Content-Type", "application/json");

    try
    {
      var response = await client.ExecutePostAsync(request);
      activity?.AddTag("url", response.ResponseUri);

      if (isRateLimited(response))
        logger.LogInformation("hit rate limit");

      if (!response.IsSuccessful)
      {
        logger.LogError($"Error with response, response content: {response.Content}", response);
        throw new Exception("error with response");
      }
      activity?.AddTag("success", true);
      return response;
    }
    catch (Exception e)
    {
      Console.WriteLine("inside post catch block");
      throw e;

    }
  }

  private static bool isRateLimited(RestResponse response) =>
    response.StatusCode == HttpStatusCode.Forbidden && response.Content?.Contains("403 Forbidden (Rate Limit Exceeded)") != null;

  public async Task<(T?, RestResponse)> PostAsync<T>(RestRequest request)
  {
    var response = await PostAsync(request);
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
    // using var activity = DiagnosticsConfig.Source.StartActivity($"sending delete web request");
    // activity?.AddTag("success", false);

    try
    {

      var response = await client.DeleteAsync(request);
      if (isRateLimited(response))
        Console.WriteLine("after delete response in rate limited");
      // Console.WriteLine(response.Content);
      // activity?.AddTag("url", response.ResponseUri);
      // activity?.AddTag("success", true);
      return response;

    }
    catch (HttpRequestException e)
    {
      if (e.StatusCode == HttpStatusCode.Forbidden) // && response.Content == "403 Forbidden (Rate Limit Exceeded)"
        logger.LogInformation("hit rate limit in delete");

      Console.WriteLine(e.StatusCode);
      // Console.WriteLine();
      throw e;

    }
  }

  private static T? deserialize<T>(RestResponse response)
  {
    // using var activity = DiagnosticsConfig.Source.StartActivity("deserializing response");
    // activity?.AddTag("url", response.ResponseUri);

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
