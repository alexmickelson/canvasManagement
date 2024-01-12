using Microsoft.Extensions.Logging;
using CanvasModel;
using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using CanvasModel.Modules;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasService(
  IWebRequestor webRequestor,
  CanvasServiceUtils utils,
  CanvasAssignmentService Assignments,
  CanvasAssignmentGroupService AssignmentGroups,
  CanvasModuleService Modules,
  CanvasQuizService Quizzes,
  CanvasCoursePageService Pages,
  MyLogger<CanvasService> logger
  )
{
  private readonly IWebRequestor webRequestor = webRequestor;
  private readonly CanvasServiceUtils utils = utils;
  private readonly MyLogger<CanvasService> logger = logger;

  public CanvasAssignmentService Assignments { get; } = Assignments;
  public CanvasAssignmentGroupService AssignmentGroups { get; } = AssignmentGroups;
  public CanvasModuleService Modules { get; } = Modules;
  public CanvasQuizService Quizzes { get; } = Quizzes;
  public CanvasCoursePageService Pages { get; } = Pages;

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
      logger.Error(response?.Content ?? "");
      logger.Error(response?.ResponseUri?.ToString() ?? "");
      throw new Exception("error getting course from canvas");
    }
    return data;
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

  public async Task UpdateModuleItem(
    ulong canvasCourseId,
    ulong canvasModuleId,
    CanvasModuleItem item
  )
  {
    logger.Log($"updating module item {item.Title}");
    var url = $"courses/{canvasCourseId}/modules/{canvasModuleId}/items/{item.Id}";
    var body = new { module_item = new { title = item.Title, position = item.Position } };
    var request = new RestRequest(url);
    request.AddBody(body);

    var (newItem, response) = await webRequestor.PutAsync<CanvasModuleItem>(request);
    if (newItem == null)
      throw new Exception("something went wrong updating module item");
  }

  public async Task CreateModuleItem(
    ulong canvasCourseId,
    ulong canvasModuleId,
    string title,
    string type,
    ulong contentId
  )
  {
    logger.Log($"creating new module item {title}");
    var url = $"courses/{canvasCourseId}/modules/{canvasModuleId}/items";
    var body = new
    {
      module_item = new
      {
        title,
        type = type.ToString(),
        content_id = contentId,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);

    var (newItem, _response) = await webRequestor.PostAsync<CanvasModuleItem>(request);
    if (newItem == null)
      throw new Exception("something went wrong updating module item");
  }
  public async Task CreateModuleItem(
    ulong canvasCourseId,
    ulong canvasModuleId,
    string title,
    string type,
    string contentId
  )
  {
    logger.Log($"creating new module item {title}");
    var url = $"courses/{canvasCourseId}/modules/{canvasModuleId}/items";
    var body = new
    {
      module_item = new
      {
        title,
        type = type.ToString(),
        content_id = contentId,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);

    var (newItem, _response) = await webRequestor.PostAsync<CanvasModuleItem>(request);
    if (newItem == null)
      throw new Exception("something went wrong updating module item with string content id");
  }
}
