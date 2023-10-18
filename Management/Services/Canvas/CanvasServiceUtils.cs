using RestSharp;

namespace Management.Services.Canvas;

public class CanvasServiceUtils
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private readonly IWebRequestor webRequestor;

  public CanvasServiceUtils(IWebRequestor webRequestor)
  {
    this.webRequestor = webRequestor;
  }

  internal async Task<IEnumerable<T>> PaginatedRequest<T>(RestRequest request)
  {
    var requestCount = 1;
    request.AddQueryParameter("per_page", "100");
    var (data, response) = await webRequestor.GetAsync<T>(request);

    if (response.ErrorMessage?.Length > 0)
    {
      Console.WriteLine("error in response");
      Console.WriteLine(response.ErrorMessage);
      throw new Exception("error in response");
    }

    var returnData = data != null ? new T[] { data } : new T[] { };
    var nextUrl = getNextUrl(response.Headers);

    while (nextUrl is not null)
    {
      requestCount += 1;
      RestRequest nextRequest = new RestRequest(nextUrl);
      var (nextData, nextResponse) = await webRequestor.GetAsync<T>(nextRequest);
      if (nextData is not null)
        returnData = returnData.Append(nextData).ToArray();
      nextUrl = getNextUrl(nextResponse.Headers);
    }

    if (requestCount > 1)
      Console.WriteLine($"Requesting {typeof(T)} took {requestCount} requests");

    return returnData;
  }

  protected static string? getNextUrl(IEnumerable<HeaderParameter>? headers) =>
    headers
      ?.ToList()
      .Find(h => h.Name == "Link")
      ?.Value?.ToString()
      ?.Split(",")
      .Where(url => url.Contains("rel=\"next\""))
      .FirstOrDefault()
      ?.Split(";")
      .FirstOrDefault()
      ?.TrimEnd('>')
      .TrimStart('<')
      .Replace(" ", "")
      .Replace(BaseUrl, "");
}
