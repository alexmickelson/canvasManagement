using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class AssignmentSyncronizationExtensions
{
  internal static async Task<LocalAssignment> SyncAssignmentToCanvas(
    this LocalCourse localCourse,
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    CanvasService canvas
  )
  {
    // ignore past assignments
    if(localAssignment.DueAt < DateTime.Now)
      return localAssignment;

    var canvasAssignment = canvasAssignments.FirstOrDefault(
      ca => ca.Id == localAssignment.CanvasId
    );
    string localHtmlDescription = localAssignment.GetDescriptionHtml(
      localCourse.Settings.AssignmentTemplates
    );

    var canvasAssignmentGroupId = localAssignment.GetCanvasAssignmentGroupId(localCourse.Settings.AssignmentGroups);

    return canvasAssignment != null
      ? await updateAssignmentIfNeeded(
        localCourse,
        canvasCourseId,
        localAssignment,
        canvasAssignments,
        canvas,
        localHtmlDescription,
        canvasAssignmentGroupId
      )
      : await canvas.Assignments.Create(canvasCourseId, localAssignment, localHtmlDescription, canvasAssignmentGroupId);
  }

  private static async Task<LocalAssignment> updateAssignmentIfNeeded(
    LocalCourse localCourse,
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    CanvasService canvas,
    string localHtmlDescription,
    ulong? canvasAssignmentGroupId
  )
  {
    var assignmentNeedsUpdates = localAssignment.NeedsUpdates(
      canvasAssignments,
      localCourse.Settings.AssignmentTemplates,
      canvasAssignmentGroupId,
      quiet: false
    );
    if (assignmentNeedsUpdates)
    {
      await canvas.Assignments.Update(
        courseId: canvasCourseId,
        localAssignment,
        localHtmlDescription,
        canvasAssignmentGroupId
      );
    }
    return localAssignment;
  }

  public static bool NeedsUpdates(
    this LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<AssignmentTemplate> courseAssignmentTemplates,
    ulong? canvasAssignmentGroupId,
    bool quiet = true
  )
  {
    var canvasAssignment = canvasAssignments.First(ca => ca.Id == localAssignment.CanvasId);

    var localHtmlDescription = localAssignment
      .GetDescriptionHtml(courseAssignmentTemplates)
      .Replace("<hr />", "<hr>")
      .Replace("&gt;", "")
      .Replace("&lt;", "")
      .Replace(">", "")
      .Replace("<", "")
      .Replace("&quot;", "")
      .Replace("\"", "")
      .Replace("&amp;", "")
      .Replace("&", "");

    var canvasHtmlDescription = canvasAssignment.Description;
    canvasHtmlDescription = CanvasScriptTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = CanvasLinkTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = canvasHtmlDescription
      .Replace("<hr />", "<hr>")
      .Replace("&gt;", "")
      .Replace("&lt;", "")
      .Replace(">", "")
      .Replace("<", "")
      .Replace("&quot;", "")
      .Replace("\"", "")
      .Replace("&amp;", "")
      .Replace("&", "");

    var canvasComparisonDueDate =
      canvasAssignment.DueAt != null
        ? new DateTime(
          year: canvasAssignment.DueAt.Value.Year,
          month: canvasAssignment.DueAt.Value.Month,
          day: canvasAssignment.DueAt.Value.Day,
          hour: canvasAssignment.DueAt.Value.Hour,
          minute: canvasAssignment.DueAt.Value.Minute,
          second: canvasAssignment.DueAt.Value.Second
        )
        : new DateTime();
    var localComparisonDueDate =
      canvasAssignment.DueAt != null
        ? new DateTime(
          year: localAssignment.DueAt.Year,
          month: localAssignment.DueAt.Month,
          day: localAssignment.DueAt.Day,
          hour: localAssignment.DueAt.Hour,
          minute: localAssignment.DueAt.Minute,
          second: localAssignment.DueAt.Second
        )
        : new DateTime();

    var canvasComparisonLockDate =
      canvasAssignment.LockAt != null
        ? new DateTime(
          year: canvasAssignment.LockAt.Value.Year,
          month: canvasAssignment.LockAt.Value.Month,
          day: canvasAssignment.LockAt.Value.Day,
          hour: canvasAssignment.LockAt.Value.Hour,
          minute: canvasAssignment.LockAt.Value.Minute,
          second: canvasAssignment.LockAt.Value.Second
        )
        : new DateTime();
    var localComparisonLockDate = localAssignment.LockAtDueDate
      ? localComparisonDueDate
      : canvasAssignment.LockAt != null
        ? new DateTime(
          year: localAssignment.LockAt?.Year ?? 0,
          month: localAssignment.LockAt?.Month ?? 0,
          day: localAssignment.LockAt?.Day ?? 0,
          hour: localAssignment.LockAt?.Hour ?? 0,
          minute: localAssignment.LockAt?.Minute ?? 0,
          second: localAssignment.LockAt?.Second ?? 0
        )
        : new DateTime();

    var dueDatesSame =
      canvasAssignment.DueAt != null && canvasComparisonDueDate == localComparisonDueDate;
    var lockDatesSame = canvasAssignment.LockAt != null && canvasComparisonLockDate == localComparisonLockDate;


    var descriptionSame = canvasHtmlDescription == localHtmlDescription;
    var nameSame = canvasAssignment.Name == localAssignment.Name;
    var pointsSame = canvasAssignment.PointsPossible == localAssignment.PointsPossible;
    var submissionTypesSame = canvasAssignment.SubmissionTypes.SequenceEqual(
      localAssignment.SubmissionTypes.Select(t => t.ToString())
    );
    var assignmentGroupSame = 
      canvasAssignmentGroupId != null 
      && canvasAssignmentGroupId == canvasAssignment.AssignmentGroupId;

    if (!quiet)
    {
      if (!dueDatesSame)
      {
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment));
        Console.WriteLine(canvasComparisonDueDate);
        Console.WriteLine(localComparisonDueDate);
        Console.WriteLine(
          $"Due dates different for assignment {localAssignment.Name}, local: {localAssignment.DueAt}, in canvas {canvasAssignment.DueAt}"
        );
        Console.WriteLine(JsonSerializer.Serialize(localAssignment.DueAt));
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment.DueAt));
      }

      if (!lockDatesSame)
      {
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment));
        Console.WriteLine(canvasComparisonLockDate);
        Console.WriteLine(localComparisonLockDate);
        Console.WriteLine(
          $"Lock dates different for assignment {localAssignment.Name}, local: {localAssignment.LockAt}, in canvas {canvasAssignment.LockAt}"
        );
        Console.WriteLine(JsonSerializer.Serialize(localAssignment.LockAt));
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment.LockAt));
      }

      if (!descriptionSame)
      {
        Console.WriteLine();
        Console.WriteLine($"descriptions different for {localAssignment.Name}");
        Console.WriteLine();

        Console.WriteLine("Local Description:");
        Console.WriteLine(localHtmlDescription);
        Console.WriteLine();
        Console.WriteLine("Canvas Description: ");
        Console.WriteLine(canvasHtmlDescription);
        Console.WriteLine();
        Console.WriteLine("Canvas Raw Description: ");
        Console.WriteLine(canvasAssignment.Description);
        Console.WriteLine();
      }

      if (!nameSame)
        Console.WriteLine(
          $"names different for {localAssignment.Name}, local: {localAssignment.Name}, in canvas {canvasAssignment.Name}"
        );
      if (!pointsSame)
        Console.WriteLine(
          $"Points different for {localAssignment.Name}, local: {localAssignment.PointsPossible}, in canvas {canvasAssignment.PointsPossible}"
        );
      if (!submissionTypesSame)
        Console.WriteLine(
          $"Submission Types different for {localAssignment.Name}, local: {JsonSerializer.Serialize(localAssignment.SubmissionTypes.Select(t => t.ToString()))}, in canvas {JsonSerializer.Serialize(canvasAssignment.SubmissionTypes)}"
        );
      if(!assignmentGroupSame)
        Console.WriteLine(
          $"Canvas assignment group ids different for {localAssignment.Name}, local: {canvasAssignmentGroupId}, in canvas {canvasAssignment.AssignmentGroupId}"
        );
    }

    return !nameSame
      || !dueDatesSame
      || !lockDatesSame
      || !descriptionSame
      || !pointsSame
      || !submissionTypesSame
      || !assignmentGroupSame;
  }

  internal static async Task<LocalCourse> SyncAssignmentsWithCanvas(
    this LocalCourse localCourse,
    ulong canvasCourseId,
    IEnumerable<CanvasAssignment> canvasAssignments,
    CanvasService canvas
  )
  {
    var moduleTasks = localCourse.Modules.Select(async m =>
    {
      var assignmentTasks = m.Assignments.Select(
        (a) => localCourse.SyncAssignmentToCanvas(canvasCourseId, a, canvasAssignments, canvas)
      );
      var assignments = await Task.WhenAll(assignmentTasks);
      return m with { Assignments = assignments };
    });

    var modules = await Task.WhenAll(moduleTasks);
    return localCourse with { Modules = modules };
  }

  [GeneratedRegex("<script.*script>")]
  private static partial Regex CanvasScriptTagRegex();

  [GeneratedRegex("<link\\s+rel=\"[^\"]*\"\\s+href=\"[^\"]*\"[^>]*>")]
  private static partial Regex CanvasLinkTagRegex();
}
