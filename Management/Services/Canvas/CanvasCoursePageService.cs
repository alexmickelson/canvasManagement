
using CanvasModel.Courses;
using CanvasModel.Modules;
using CanvasModel.Pages;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;
public class CanvasCoursePageService(
  IWebRequestor webRequestor,
  CanvasServiceUtils utils,
  MyLogger<CanvasCoursePageService> logger
  )
{
  private readonly IWebRequestor webRequestor = webRequestor;
  private readonly CanvasServiceUtils utils = utils;
  private readonly MyLogger<CanvasCoursePageService> log = logger;



  public async Task<IEnumerable<CanvasPage>> GetAll(ulong courseId)
  {
    var url = $"courses/{courseId}/pages";
    var request = new RestRequest(url);
    // request.AddParameter("include[]", "overrides");
    var pagesResponse = await utils.PaginatedRequest<IEnumerable<CanvasPage>>(request);
    return pagesResponse.SelectMany(
      pages => pages
    );
  }


  public async Task<CanvasPage> Create(
    ulong canvasCourseId,
    LocalCoursePage localCourse
  )
  {
    log.Log($"creating course page: {localCourse.Name}");
    var url = $"courses/{canvasCourseId}/pages";
    var request = new RestRequest(url);
    var body = new
    {
      title = localCourse.Name,
      body = localCourse.GetBodyHtml()
    };
    var bodyObj = new { wiki_page = body };
    request.AddBody(bodyObj);
    var (canvasPage, response) = await webRequestor.PostAsync<CanvasPage>(request);
    if (canvasPage == null)
      throw new Exception("created canvas course page was null");

    return canvasPage;
  }

  public async Task Update(
    ulong courseId,
    ulong canvasPageId,
    LocalCoursePage localCoursePage
  )
  {
    log.Log($"updating course page: {localCoursePage.Name}");
    var url = $"courses/{courseId}/pages/{canvasPageId}";
    var request = new RestRequest(url);
    var body = new
    {
      title = localCoursePage.Name,
      body = localCoursePage.GetBodyHtml()
    };
    var bodyObj = new { wiki_page = body };
    request.AddBody(bodyObj);

    await webRequestor.PutAsync(request);
  }

  public async Task Delete(ulong courseId, ulong canvasPageId)
  {
    log.Log($"deleting page from canvas {canvasPageId}");
    var url = $"courses/{courseId}/pages/{canvasPageId}";
    var request = new RestRequest(url);
    var response = await webRequestor.DeleteAsync(request);
    if (!response.IsSuccessful)
    {
      log.Log(url);
      throw new Exception("Failed to delete canvas course page");
    }
  }
}
