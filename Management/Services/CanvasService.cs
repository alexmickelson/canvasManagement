using CanvasModel;
using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using RestSharp;

public interface ICanvasService
{
  Task<IEnumerable<EnrollmentTermModel>> GetCurrentTermsFor(DateTime? _queryDate = null);
  Task<IEnumerable<EnrollmentTermModel>> GetTerms();
}

public class CanvasService : ICanvasService
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
    var terms = termResponses.Select(r => r.EnrollmentTerms).SelectMany(s => s).ToArray();
    return terms;
  }

  public async Task<IEnumerable<CourseModel>> GetCourses(ulong termId)
  {
    var url = $"courses";
    var request = new RestRequest(url);
    var coursesResponse = await PaginatedRequest<IEnumerable<CourseModel>>(request);
    return coursesResponse.SelectMany(c => c).Where(c => c.EnrollmentTermId == termId).ToArray();
  }

  public async Task<CourseModel> GetCourse(ulong courseId)
  {
    var url = $"courses/{courseId}";
    var request = new RestRequest(url);
    var (data, response) = await webRequestor.GetAsync<CourseModel>(request);

    if (data == null)
    {
      System.Console.WriteLine(response.Content);
      System.Console.WriteLine(response.ResponseUri);
      throw new Exception("error getting course from canvas");
    }
    return data;
  }

  public async Task<IEnumerable<CourseModule>> GetModules(ulong courseId)
  {
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    var modules = await PaginatedRequest<IEnumerable<CourseModule>>(request);
    return modules.SelectMany(c => c).ToArray();
  }

  public async Task CreateModule(ulong courseId, string name)
  {
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    request.AddParameter("module[name]", name);

    await webRequestor.PostAsync(request);
  }

  private async Task<IEnumerable<T>> PaginatedRequest<T>(RestRequest request)
  {
    var requestCount = 1;
    request.AddQueryParameter("per_page", "100");
    var (data, response) = await webRequestor.GetAsync<T>(request);

    if (response.ErrorMessage?.Length > 0)
    {
      System.Console.WriteLine("error in response");
      System.Console.WriteLine(response.ErrorMessage);
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

    System.Console.WriteLine($"Requesting {typeof(T)} took {requestCount} requests");

    return returnData;
  }

  private static string? getNextUrl(IEnumerable<HeaderParameter>? headers) =>
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

  public async Task<IEnumerable<EnrollmentTermModel>> GetCurrentTermsFor(
    DateTime? _queryDate = null
  )
  {
    DateTime queryDate = _queryDate ?? DateTime.Now;

    var terms = await GetTerms();

    var currentTerms = terms
      .Where(t => t.EndAt != null && t.EndAt > queryDate && t.EndAt < queryDate.AddYears(1))
      .Take(3)
      .OrderBy(t => t.StartAt);

    return currentTerms;
  }
}
