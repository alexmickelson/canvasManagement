using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using RestSharp;
public class CanvasService
{
  private const string BaseUrl = "https://snow.instructure.com/api/v1/";
  private readonly IWebRequestor webRequestor;
  private RestClient client;
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
    var terms = await PaginatedRequest<EnrollmentTermModel>(request);
    return terms;
  }

  private async Task<IEnumerable<T>> PaginatedRequest<T>(RestRequest request)
  {
    var requestCount = 1;
    request.AddQueryParameter("per_page", "100");
    IEnumerable<T> returnData = new T[] { };
    RestResponse<T[]> response = await webRequestor.GetAsync<T>(request);
    returnData = returnData.Concat(response.Data);

    var nextUrl = getNextUrl(response);

    while (nextUrl is not null)
    {
      requestCount += 1;
      var nextRequest = new RestRequest(nextUrl);
      var nextResponse = await webRequestor.GetAsync<T>(nextRequest);
      if (nextResponse.Data is not null)
        returnData = returnData.Concat(nextResponse.Data);
      nextUrl = getNextUrl(nextResponse);
    }

    System.Console.WriteLine($"Requesting {typeof(T)} took {requestCount} requests");

    return returnData;
  }


  private static string? getNextUrl<T>(RestResponse<T[]> response) => response.Headers?
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