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
          a => a with { DueAt = a.DueAt?.ToLocalTime(), LockAt = a.LockAt?.ToLocalTime() }
        )
    );
  }

  public async Task<LocalAssignment> Create(
    ulong courseId,
    LocalAssignment localAssignment,
    string htmlDescription
  )
  {
    System.Console.WriteLine($"creating assignment: {localAssignment.name}");
    var url = $"courses/{courseId}/assignments";
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
    var (canvasAssignment, response) = await webRequestor.PostAsync<CanvasAssignment>(request);
    if (canvasAssignment == null)
      throw new Exception("created canvas assignment was null");

    var updatedLocalAssignment = localAssignment with
    {
      canvasId = canvasAssignment.Id
    };

    await CreateRubric(courseId, updatedLocalAssignment);

    return updatedLocalAssignment;
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

    await CreateRubric(courseId, localAssignment);
  }

  public async Task CreateRubric(ulong courseId, LocalAssignment localAssignment)
  {
    if (localAssignment.canvasId == null)
      throw new Exception("cannot create rubric if no canvas id in assignment");

    var criterion = new Dictionary<int, object>();

    var i = 0;
    foreach (var rubricItem in localAssignment.rubric)
    {
      var ratings = new Dictionary<int, object>
      {
        { 0, new { description = "Full Marks", points = rubricItem.Points } },
        { 1, new { description = "No Marks", points = 0 } },
      };
      criterion[i] = new
      {
        description = rubricItem.Label,
        points = rubricItem.Points,
        ratings = ratings
      };
      i++;
    }

    // https://canvas.instructure.com/doc/api/rubrics.html#method.rubrics.create
    var body = new
    {
      rubric_association_id = localAssignment.canvasId,
      rubric = new
      {
        title = $"Rubric for Assignment: {localAssignment.name}",
        association_id = localAssignment.canvasId,
        association_type = "Assignment",
        use_for_grading = true,
        criteria = criterion,
      },
      rubric_association = new
      {
        association_id = localAssignment.canvasId,
        association_type = "Assignment",
        purpose = "grading",
        use_for_grading = true,
      }
    };
    var creationUrl = $"courses/{courseId}/rubrics";
    var rubricCreationRequest = new RestRequest(creationUrl);
    rubricCreationRequest.AddBody(body);
    rubricCreationRequest.AddHeader("Content-Type", "application/json");

    var (rubricCreationResponse, creationResponse) =
      await webRequestor.PostAsync<CanvasRubricCreationResponse>(rubricCreationRequest);

    if (rubricCreationResponse == null)
      throw new Exception("failed to create rubric before association");

    var assignmentPointCorrectionBody = new
    {
      assignment = new { points_possible = localAssignment.points_possible }
    };
    var adjustmentUrl = $"courses/{courseId}/assignments/{localAssignment.canvasId}";
    var pointAdjustmentRequest = new RestRequest(adjustmentUrl);
    pointAdjustmentRequest.AddBody(assignmentPointCorrectionBody);
    pointAdjustmentRequest.AddHeader("Content-Type", "application/json");
    var (updatedAssignment, adjustmentResponse) = await webRequestor.PutAsync<CanvasAssignment>(
      pointAdjustmentRequest
    );
  }
}
