using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using RestSharp;
public class CanvasService
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private readonly IWebRequestor webRequestor;
  private string courseid { get; }
  public CanvasService(IWebRequestor webRequestor)
  {
    courseid = "774898";
    this.webRequestor = webRequestor;
  }

  public async Task<IEnumerable<EnrollmentTermModel>> GetTerms()
  {
    var url = $"accounts/10/terms";

    var request = new RestRequest(url);
    var termResponses = await PaginatedRequest<RedundantEnrollmentTermsResponse>(request);
    var terms = termResponses
      .Select(r => r.EnrollmentTerms)
      .SelectMany(s => s).ToArray();
    return terms;
  }

  private async Task<IEnumerable<T>> PaginatedRequest<T>(RestRequest request)
  {
    var requestCount = 1;
    request.AddQueryParameter("per_page", "100");
    RestResponse<T> response = await webRequestor.GetAsync<T>(request);
    var returnData = response.Data != null
      ? new T[] { response.Data }
      : new T[] { };
    var nextUrl = getNextUrl(response.Headers);

    while (nextUrl is not null)
    {
      requestCount += 1;
      RestRequest nextRequest = new RestRequest(nextUrl);
      var nextResponse = await webRequestor.GetAsync<T>(nextRequest);
      if (nextResponse.Data is not null)
        returnData = returnData.Append(nextResponse.Data).ToArray();
      nextUrl = getNextUrl(nextResponse.Headers);
    }

    System.Console.WriteLine($"Requesting {typeof(T)} took {requestCount} requests");

    return returnData;
  }


  private static string? getNextUrl(IEnumerable<HeaderParameter>? headers) => headers?
      .ToList()
      .Find(h => h.Name == "Link")?
      .Value?
      .ToString()?
      .Split(",")
      .Where(url => url.Contains("rel=\"next\""))
      .FirstOrDefault()?
      .Split(";")
      .FirstOrDefault()?
      .TrimEnd('>')
      .TrimStart('<')
      .Replace(" ", "")
      .Replace(BaseUrl, "");
}