using CanvasModel.Assignments;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;
public interface ICanvasAssignmentService
{
  Task<IEnumerable<CanvasAssignment>> GetAll(ulong courseId);
  Task<ulong> Create(
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    ulong? canvasAssignmentGroupId
  );
  Task Update(
    ulong courseId,
    ulong canvasAssignmentId,
    LocalAssignment localAssignment,
    ulong? canvasAssignmentGroupId
  );
  Task Delete(ulong courseId, ulong assignmentCanvasId, string assignmentName);
  Task CreateRubric(ulong courseId, ulong assignmentCanvasId, LocalAssignment localAssignment);
}
public class CanvasAssignmentService(
  IWebRequestor webRequestor,
  CanvasServiceUtils utils,
  MyLogger<CanvasAssignmentService> logger
  ): ICanvasAssignmentService
{
  private readonly IWebRequestor webRequestor = webRequestor;
  private readonly CanvasServiceUtils utils = utils;
  private readonly MyLogger<CanvasAssignmentService> log = logger;

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
        ).ToArray()
    ).ToArray();
  }

  public async Task<ulong> Create(
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    ulong? canvasAssignmentGroupId
  )
  {
    log.Log($"creating assignment: {localAssignment.Name}");
    var url = $"courses/{canvasCourseId}/assignments";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignment.Name,
      submission_types = localAssignment.SubmissionTypes.Select(t => t.ToString()),
      allowed_extensions = localAssignment.AllowedFileUploadExtensions.Select(e => e.ToString()),
      description = localAssignment.GetDescriptionHtml(),
      due_at = localAssignment.DueAt,
      lock_at = localAssignment.LockAt,
      points_possible = localAssignment.PointsPossible,
      assignment_group_id = canvasAssignmentGroupId,
    };
    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);
    var (canvasAssignment, response) = await webRequestor.PostAsync<CanvasAssignment>(request);
    if (canvasAssignment == null)
      throw new Exception("created canvas assignment was null");


    await CreateRubric(canvasCourseId, canvasAssignment.Id, localAssignment);

    return canvasAssignment.Id;
  }

  public async Task Update(
    ulong courseId,
    ulong canvasAssignmentId,
    LocalAssignment localAssignment,
    ulong? canvasAssignmentGroupId
  )
  {
    log.Log($"updating assignment: {localAssignment.Name}");
    var url = $"courses/{courseId}/assignments/{canvasAssignmentId}";
    var request = new RestRequest(url);
    var body = new
    {
      name = localAssignment.Name,
      submission_types = localAssignment.SubmissionTypes.Select(t => t.ToString()),
      description = localAssignment.GetDescriptionHtml(),
      due_at = localAssignment.DueAt,
      lock_at = localAssignment.LockAt,
      points_possible = localAssignment.PointsPossible,
      assignment_group_id = canvasAssignmentGroupId,
    };

    var bodyObj = new { assignment = body };
    request.AddBody(bodyObj);

    await webRequestor.PutAsync(request);

    await CreateRubric(courseId, canvasAssignmentId, localAssignment);
  }

  public async Task Delete(ulong courseId, ulong assignmentCanvasId, string assignmentName)
  {
    log.Log($"deleting assignment from canvas {assignmentName}");
    var url = $"courses/{courseId}/assignments/{assignmentCanvasId}";
    var request = new RestRequest(url);
    var response = await webRequestor.DeleteAsync(request);
    if (!response.IsSuccessful)
    {
      log.Log(url);
      throw new Exception("Failed to delete assignment");
    }
  }

  public async Task CreateRubric(ulong courseId, ulong assignmentCanvasId, LocalAssignment localAssignment)
  {

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
      rubric_association_id = assignmentCanvasId,
      rubric = new
      {
        title = $"Rubric for Assignment: {localAssignment.Name}",
        association_id = assignmentCanvasId,
        association_type = "Assignment",
        use_for_grading = true,
        criteria = criterion,
      },
      rubric_association = new
      {
        association_id = assignmentCanvasId,
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
    var adjustmentUrl = $"courses/{courseId}/assignments/{assignmentCanvasId}";
    var pointAdjustmentRequest = new RestRequest(adjustmentUrl);
    pointAdjustmentRequest.AddBody(assignmentPointCorrectionBody);
    var (_, _) = await webRequestor.PutAsync<CanvasAssignment>(pointAdjustmentRequest);
  }
}
