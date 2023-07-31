using CanvasModel.Assignments;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasAssignmentService
{
  private IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;

  public CanvasAssignmentService(IWebRequestor webRequestor, CanvasServiceUtils utils)
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
  }

  public async Task<IEnumerable<CanvasAssignment>> GetAll(ulong courseId)
  {
    var url = $"courses/{courseId}/assignments";
    var request = new RestRequest(url);
    var assignmentResponse = await utils.PaginatedRequest<IEnumerable<CanvasAssignment>>(request);
    return assignmentResponse.SelectMany(
      assignments =>
        assignments.Select(
          a =>
            a with
            {
              DueAt = a.DueAt?.ToLocalTime(),
              LockAt = a.LockAt?.ToLocalTime()
            }
        )
    );
  }

  public async Task<CanvasAssignment> Create(
    ulong courseId,
    string name,
    IEnumerable<SubmissionType> submissionTypes,
    string? description,
    DateTime? dueAt,
    DateTime? lockAt,
    int? pointsPossible
  )
  {
    System.Console.WriteLine($"creating assignment: {name}");
    var url = $"courses/{courseId}/assignments";
    var request = new RestRequest(url);
    var body = new CanvasAssignmentCreationRequest()
    {
      name = name,
      submission_types = submissionTypes.Select(t => t.ToString()),
      description = description ?? "",
      due_at = dueAt,
      lock_at = lockAt,
      points_possible = pointsPossible ?? 0
    };
    request.AddHeader("Content-Type", "application/json");
    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);
    var (canvasAssignment, response) = await webRequestor.PostAsync<CanvasAssignment>(request);
    if (canvasAssignment == null)
      throw new Exception("created canvas assignment was null");
    return canvasAssignment with
    {
      DueAt = canvasAssignment.DueAt?.ToLocalTime(),
      LockAt = canvasAssignment.LockAt?.ToLocalTime()
    };
  }

  public async Task Update(ulong courseId, LocalAssignment localAssignment, string htmlDescription)
  {
    System.Console.WriteLine($"updating assignment: {localAssignment.name}");
    var url = $"courses/{courseId}/assignments/{localAssignment.canvasId}";
    var request = new RestRequest(url);
    var body = new CanvasAssignmentCreationRequest()
    {
      name = localAssignment.name,
      submission_types = localAssignment.submission_types.Select(t => t.ToString()),
      description = htmlDescription,
      due_at = localAssignment.due_at,
      lock_at = localAssignment.lock_at,
      points_possible = localAssignment.points_possible
    };
    request.AddHeader("Content-Type", "application/json");
    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);
    await webRequestor.PutAsync(request);
  }
}
