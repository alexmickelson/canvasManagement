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
  private static int rateLimitRetryCount = 6;
  private static int rateLimitSleepInterval = 1000;

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

  public async Task<RestResponse> PostAsync(RestRequest request) => await rateLimitAwarePostAsync(request, 0);


  private async Task<RestResponse> rateLimitAwarePostAsync(RestRequest request, int retryCount = 0)
  {
    request.AddHeader("Content-Type", "application/json");

    var response = await client.ExecutePostAsync(request);

    if (isRateLimited(response))
    {
      if (retryCount < rateLimitRetryCount)
      {
        logger.LogInformation($"hit rate limit on post, retry count is {retryCount} / {rateLimitRetryCount}, retrying");
        Console.WriteLine($"hit rate limit on post, retry count is {retryCount} / {rateLimitRetryCount}, retrying");
        Thread.Sleep(rateLimitSleepInterval);
        return await rateLimitAwarePostAsync(request, retryCount + 1);
      }
    }

    if (!response.IsSuccessful)
    {
      logger.LogError($"Error with response, response content: {response.Content}");
      throw new Exception($"error post response, retrycount: {retryCount}, ratelimited: {isRateLimited(response)}, code: {response.StatusCode}, response content: {response.Content}");
    }
    return response;
  }

  private static bool isRateLimited(RestResponse response)
  {
    if (response.Content == null)
      return false;
    return response.StatusCode == HttpStatusCode.Forbidden
      && response.Content.Contains("403 Forbidden (Rate Limit Exceeded)");
  }

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

  public Task<RestResponse> DeleteAsync(RestRequest request) => recursiveDeleteAsync(request, 0);
  private async Task<RestResponse> recursiveDeleteAsync(RestRequest request, int retryCount)
  {
    try
    {
      var response = await client.DeleteAsync(request);
      if (isRateLimited(response))
        Console.WriteLine("after delete response in rate limited");
      return response;
    }
    catch (HttpRequestException e)
    {
      if (e.StatusCode == HttpStatusCode.Forbidden) // && response.Content == "403 Forbidden (Rate Limit Exceeded)"
      {
        if (retryCount < rateLimitRetryCount)
        {
          logger.LogInformation($"hit rate limit in delete, retry count is {retryCount} / {rateLimitRetryCount}, retrying");
          Console.WriteLine($"hit rate limit in delete, retry count is {retryCount} / {rateLimitRetryCount}, retrying");
          Thread.Sleep(rateLimitSleepInterval);
          return await recursiveDeleteAsync(request, retryCount + 1);
        }
        else
        {
          logger.LogInformation($"hit rate limit in delete, {rateLimitRetryCount} retries did not fix it");
        }
      }
      throw;
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
