using CanvasModel.Assignments;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasAssignmentService
{
  private readonly IWebRequestor webRequestor;
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
    // request.AddParameter("include[]", "overrides");
    var assignmentResponse = await utils.PaginatedRequest<IEnumerable<CanvasAssignment>>(request);
    return assignmentResponse.SelectMany(
      assignments =>
        assignments.Select(
          a => a with { DueAt = a.DueAt?.ToLocalTime(), LockAt = a.LockAt?.ToLocalTime() }
        )
    );
  }

  public async Task<LocalAssignment> Create(
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    string htmlDescription,
    ulong? canvasAssignmentGroupId
  )
  {
    Console.WriteLine($"creating assignment: {localAssignment.Name}");
    var url = $"courses/{canvasCourseId}/assignments";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignment.Name,
      submission_types = localAssignment.SubmissionTypes.Select(t => t.ToString()),
      description = htmlDescription,
      due_at = localAssignment.DueAt,
      lock_at = localAssignment.LockAtDueDate ? localAssignment.DueAt : localAssignment.LockAt,
      points_possible = localAssignment.PointsPossible,
      assignment_group_id = canvasAssignmentGroupId,
    };
    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);
    var (canvasAssignment, response) = await webRequestor.PostAsync<CanvasAssignment>(request);
    if (canvasAssignment == null)
      throw new Exception("created canvas assignment was null");

    var updatedLocalAssignment = localAssignment with { CanvasId = canvasAssignment.Id };

    await CreateRubric(canvasCourseId, updatedLocalAssignment);

    return updatedLocalAssignment;
  }

  public async Task Update(
    ulong courseId,
    LocalAssignment localAssignment,
    string htmlDescription,
    ulong? canvasAssignmentGroupId
  )
  {
    Console.WriteLine($"updating assignment: {localAssignment.Name}");
    var url = $"courses/{courseId}/assignments/{localAssignment.CanvasId}";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignment.Name,
      submission_types = localAssignment.SubmissionTypes.Select(t => t.ToString()),
      description = htmlDescription,
      due_at = localAssignment.DueAt,
      lock_at = localAssignment.LockAtDueDate ? localAssignment.DueAt : localAssignment.LockAt,
      points_possible = localAssignment.PointsPossible,
      assignment_group_id = canvasAssignmentGroupId,
    };
    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);
    Console.WriteLine(url);
    Console.WriteLine(JsonSerializer.Serialize(bodyObj));
    await webRequestor.PutAsync(request);

    await CreateRubric(courseId, localAssignment);
  }

  public async Task Delete(ulong courseId, LocalAssignment assignment)
  {
    Console.WriteLine($"deleting assignment from canvas {assignment.Name}");
    var url = $"courses/{courseId}/assignments/{assignment.CanvasId}";
    var request = new RestRequest(url);
    var response = await webRequestor.DeleteAsync(request);
    if (!response.IsSuccessful)
    {
      Console.WriteLine(url);
      throw new Exception("Failed to delete assignment");
    }
  }

  public async Task CreateRubric(ulong courseId, LocalAssignment localAssignment)
  {
    if (localAssignment.CanvasId == null)
      throw new Exception("cannot create rubric if no canvas id in assignment");

    var criterion = new Dictionary<int, object>();

    var i = 0;
    foreach (var rubricItem in localAssignment.Rubric)
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
        ratings
      };
      i++;
    }

    // https://canvas.instructure.com/doc/api/rubrics.html#method.rubrics.create
    var body = new
    {
      rubric_association_id = localAssignment.CanvasId,
      rubric = new
      {
        title = $"Rubric for Assignment: {localAssignment.Name}",
        association_id = localAssignment.CanvasId,
        association_type = "Assignment",
        use_for_grading = true,
        criteria = criterion,
      },
      rubric_association = new
      {
        association_id = localAssignment.CanvasId,
        association_type = "Assignment",
        purpose = "grading",
        use_for_grading = true,
      }
    };
    var creationUrl = $"courses/{courseId}/rubrics";
    var rubricCreationRequest = new RestRequest(creationUrl);
    rubricCreationRequest.AddBody(body);
    var (rubricCreationResponse, _) = await webRequestor.PostAsync<CanvasRubricCreationResponse>(
      rubricCreationRequest
    );

    if (rubricCreationResponse == null)
      throw new Exception("failed to create rubric before association");

    var assignmentPointCorrectionBody = new
    {
      assignment = new { points_possible = localAssignment.PointsPossible }
    };
    var adjustmentUrl = $"courses/{courseId}/assignments/{localAssignment.CanvasId}";
    var pointAdjustmentRequest = new RestRequest(adjustmentUrl);
    pointAdjustmentRequest.AddBody(assignmentPointCorrectionBody);
    var (_, _) = await webRequestor.PutAsync<CanvasAssignment>(pointAdjustmentRequest);
  }
}
