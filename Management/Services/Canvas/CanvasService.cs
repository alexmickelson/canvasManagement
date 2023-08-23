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
  public CanvasAssignmentGroupService AssignmentGroups { get; }
  public CanvasQuizService Quizzes { get; }

  public CanvasService(
    IWebRequestor webRequestor,
    CanvasServiceUtils utils,
    CanvasAssignmentService Assignments,
    CanvasAssignmentGroupService AssignmentGroups,
    CanvasQuizService Quizzes
  )
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
    this.Assignments = Assignments;
    this.AssignmentGroups = AssignmentGroups;
    this.Quizzes = Quizzes;
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
      Console.WriteLine(response.Content);
      Console.WriteLine(response.ResponseUri);
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

  public async Task<CanvasModule> CreateModule(ulong courseId, string name)
  {
    Console.WriteLine($"Creating Module: {name}");
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    var body = new
    {
      module = new
      {
        name = name
      }
    };
    request.AddBody(body);

    var (newModule, _) = await webRequestor.PostAsync<CanvasModule>(request);
    return newModule ?? throw new Exception($"failed to create new canvas module {name}");
  }

  public async Task UpdateModule(ulong courseId, ulong moduleId, string name, int position)
  {
    Console.WriteLine($"Updating Module: {name}");
    var url = $"courses/{courseId}/modules/{moduleId}";
    var body = new { module = new { name = name, position = position } };
    var request = new RestRequest(url);
    request.AddBody(body);

    await webRequestor.PutAsync(request);
  }

  public async Task<IEnumerable<CanvasModuleItem>> GetModuleItems(ulong courseId, ulong moduleId)
  {
    var url = $"courses/{courseId}/modules/{moduleId}/items";
    var request = new RestRequest(url);
    var (items, response) = await webRequestor.GetAsync<IEnumerable<CanvasModuleItem>>(request);
    if (items == null)
      throw new Exception($"Error getting canvas module items for {url}");
    return items;
  }

  public async Task<Dictionary<ulong, IEnumerable<CanvasModuleItem>>> GetAllModulesItems(
    ulong courseId,
    IEnumerable<CanvasModule> modules
  )
  {
    var itemsTasks = modules.Select(
      async (m) =>
      {
        var items = await GetModuleItems(courseId, m.Id);
        return (m, items);
      }
    );

    var output = new Dictionary<ulong, IEnumerable<CanvasModuleItem>>();
    var itemTasksResult = await Task.WhenAll(itemsTasks);
    foreach (var (module, items) in itemTasksResult)
    {
      if (module == null || items == null)
        throw new Exception(
          "i'm not sure how we got here, but module and items are null after looking up module items"
        );
      output[module.Id] = items;
    }
    return output;
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
    Console.WriteLine($"updating module item {item.Title}");
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
    Console.WriteLine($"creating new module item {title}");
    var url = $"courses/{canvasCourseId}/modules/{canvasModuleId}/items";
    var body = new
    {
      module_item = new
      {
        title = title,
        type = type.ToString(),
        content_id = contentId,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);

    var (newItem, response) = await webRequestor.PostAsync<CanvasModuleItem>(request);
    if (newItem == null)
      throw new Exception("something went wrong updating module item");
  }
}
