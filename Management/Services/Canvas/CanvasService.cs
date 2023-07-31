using CanvasModel;
using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using CanvasModel.Modules;
using RestSharp;
namespace Management.Services.Canvas;

public class CanvasService
{
  private readonly IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;

  public CanvasAssignmentService Assignments { get; }

  public CanvasService(
    IWebRequestor webRequestor,
    CanvasServiceUtils utils,
    CanvasAssignmentService Assignments
  )
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
    this.Assignments = Assignments;
  }

  public async Task<IEnumerable<EnrollmentTermModel>> GetTerms()
  {
    var url = $"accounts/10/terms";

    var request = new RestRequest(url);
    var termResponses = await utils.PaginatedRequest<RedundantEnrollmentTermsResponse>(request);
    var terms = termResponses.Select(r => r.EnrollmentTerms).SelectMany(s => s).ToArray();
    return terms;
  }

  public async Task<IEnumerable<CourseModel>> GetCourses(ulong termId)
  {
    var url = $"courses";
    var request = new RestRequest(url);
    var coursesResponse = await utils.PaginatedRequest<IEnumerable<CourseModel>>(request);
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

  public async Task<IEnumerable<CanvasModule>> GetModules(ulong courseId)
  {
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    var modules = await utils.PaginatedRequest<IEnumerable<CanvasModule>>(request);
    return modules.SelectMany(c => c).ToArray();
  }

  public async Task CreateModule(ulong courseId, string name)
  {
    Console.WriteLine($"Creating Module: {name}");
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    request.AddParameter("module[name]", name);

    await webRequestor.PostAsync(request);
  }

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
