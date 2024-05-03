using CanvasModel.Assignments;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;


public interface ICanvasAssignmentGroupService
{
  Task<IEnumerable<CanvasAssignmentGroup>> GetAll(ulong courseId);
  Task<LocalAssignmentGroup> Create(ulong canvasCourseId, LocalAssignmentGroup localAssignmentGroup);
  Task Update(ulong canvasCourseId, LocalAssignmentGroup localAssignmentGroup);

}
public class CanvasAssignmentGroupService: ICanvasAssignmentGroupService
{
  private readonly IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;
  private readonly MyLogger<CanvasAssignmentGroupService> logger;

  public CanvasAssignmentGroupService(
    IWebRequestor webRequestor,
    CanvasServiceUtils utils,
    MyLogger<CanvasAssignmentGroupService> logger
  )
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
    this.logger = logger;
  }
  public async Task<IEnumerable<CanvasAssignmentGroup>> GetAll(ulong courseId)
  {
    var url = $"courses/{courseId}/assignment_groups";
    var request = new RestRequest(url);
    var assignmentResponse = await utils.PaginatedRequest<IEnumerable<CanvasAssignmentGroup>>(request);
    return assignmentResponse.SelectMany(
      assignments => assignments
    );
  }

  public async Task<LocalAssignmentGroup> Create(
    ulong canvasCourseId,
    LocalAssignmentGroup localAssignmentGroup
  )
  {
    logger.Log($"creating assignment group: {localAssignmentGroup.Name}");
    var url = $"courses/{canvasCourseId}/assignment_groups";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignmentGroup.Name,
      group_weight = localAssignmentGroup.Weight,
    };
    request.AddBody(body);

    var (canvasAssignmentGroup, response) = await webRequestor.PostAsync<CanvasAssignmentGroup>(request);
    if (canvasAssignmentGroup == null)
      throw new Exception("created canvas assignment group was null");

    return localAssignmentGroup with
    {
      CanvasId = canvasAssignmentGroup.Id
    };
  }
  public async Task Update(
    ulong canvasCourseId,
    LocalAssignmentGroup localAssignmentGroup
  )
  {
    logger.Log($"updating assignment group: {localAssignmentGroup.Name}");
    if (localAssignmentGroup.CanvasId == null)
      throw new Exception("cannot update assignment group if canvas id is null");
    var url = $"courses/{canvasCourseId}/assignment_groups/{localAssignmentGroup.CanvasId}";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignmentGroup.Name,
      group_weight = localAssignmentGroup.Weight,
    };
    request.AddBody(body);

    await webRequestor.PutAsync<CanvasAssignmentGroup>(request);
  }
}
