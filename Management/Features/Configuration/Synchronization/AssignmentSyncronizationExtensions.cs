using System.Net.Quic;
using System.Reflection;
using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class AssignmentSyncronizationExtensions
{
  internal static async Task<ulong> SyncAssignmentToCanvas(
    this LocalCourse localCourse,
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    ICanvasService canvas
  )
  {
    var canvasAssignment = canvasAssignments.FirstOrDefault(
      ca => ca.Name == localAssignment.Name
    );

    var canvasAssignmentGroupId = localAssignment.GetCanvasAssignmentGroupId(localCourse.Settings.AssignmentGroups);

    return canvasAssignment != null
      ? await updateAssignmentIfNeeded(
        localCourse,
        canvasCourseId,
        localAssignment,
        canvasAssignment,
        canvas,
        canvasAssignmentGroupId
      )
      : await canvas.Assignments.Create(canvasCourseId, localAssignment, canvasAssignmentGroupId);
  }

  private static async Task<ulong> updateAssignmentIfNeeded(
    LocalCourse localCourse,
    ulong canvasCourseId,
    LocalAssignment localAssignment,
    CanvasAssignment canvasAssignment,
    ICanvasService canvas,
    ulong? canvasAssignmentGroupId
  )
  {
    var assignmentNeedsUpdates = localAssignment.NeedsUpdates(
      canvasAssignment,
      canvasAssignmentGroupId,
      quiet: false
    );
    if (assignmentNeedsUpdates)
    {
      await canvas.Assignments.Update(
        courseId: canvasCourseId,
        canvasAssignmentId: canvasAssignment.Id,
        localAssignment,
        canvasAssignmentGroupId
      );
    }
    return canvasAssignment.Id;
  }

  public static bool NeedsUpdates(
    this LocalAssignment localAssignment,
    CanvasAssignment canvasAssignment,
    ulong? canvasAssignmentGroupId,
    bool quiet = true
  )
  {
    var reason = localAssignment.GetUpdateReason(canvasAssignment, canvasAssignmentGroupId, quiet);
    return reason != string.Empty;
  }
  
  public static string GetUpdateReason(
    this LocalAssignment localAssignment,
    CanvasAssignment canvasAssignment,
    ulong? canvasAssignmentGroupId,
    bool quiet = true
  )
  {
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
    var dueDatesSame = canvasAssignment.DueAt != null && canvasComparisonDueDate == localComparisonDueDate;
    if (!dueDatesSame)
    {
      var reason = $"Due dates different for assignment {localAssignment.Name}, local: {localAssignment.DueAt}, in canvas {canvasAssignment.DueAt}";
      if (!quiet)
      {
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment));
        Console.WriteLine(canvasComparisonDueDate);
        Console.WriteLine(localComparisonDueDate);
        Console.WriteLine(reason);
        Console.WriteLine(JsonSerializer.Serialize(localAssignment.DueAt));
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment.DueAt));
      }
      return reason;
    }


    DateTime? canvasComparisonLockDate = canvasAssignment.LockAt != null
        ? new DateTime(
          year: canvasAssignment.LockAt.Value.Year,
          month: canvasAssignment.LockAt.Value.Month,
          day: canvasAssignment.LockAt.Value.Day,
          hour: canvasAssignment.LockAt.Value.Hour,
          minute: canvasAssignment.LockAt.Value.Minute,
          second: canvasAssignment.LockAt.Value.Second
        )
        : null;
    DateTime? localComparisonLockDate = localAssignment.LockAt != null
      ? new DateTime(
        year: localAssignment.LockAt.Value.Year,
        month: localAssignment.LockAt.Value.Month,
        day: localAssignment.LockAt.Value.Day,
        hour: localAssignment.LockAt.Value.Hour,
        minute: localAssignment.LockAt.Value.Minute,
        second: localAssignment.LockAt.Value.Second
      )
      : null;

    if (canvasComparisonLockDate != localComparisonLockDate)
    {
      var printableLocal = localComparisonLockDate?.ToString() ?? "null";
      var printableCanvas = canvasComparisonLockDate?.ToString() ?? "null";
      var reason = $"Lock dates different for assignment {localAssignment.Name}, local: {printableLocal}, in canvas {printableCanvas}";

      if (!quiet)
      {
        // Console.WriteLine(JsonSerializer.Serialize(canvasAssignment));
        Console.WriteLine(canvasComparisonLockDate);
        Console.WriteLine(localComparisonLockDate);
        Console.WriteLine(reason);
        Console.WriteLine(JsonSerializer.Serialize(localAssignment.LockAt));
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment.LockAt));
      }
      return reason;
    }



    var localHtmlDescription = removeHtmlDetails(localAssignment.GetDescriptionHtml());

    var canvasHtmlDescription = canvasAssignment.Description;
    canvasHtmlDescription = CanvasScriptTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = CanvasLinkTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = removeHtmlDetails(canvasHtmlDescription);

    var descriptionSame = canvasHtmlDescription == localHtmlDescription;
    if (!descriptionSame)
    {
      var reason = $"descriptions different for {localAssignment.Name}";
      if (!quiet)
      {
        Console.WriteLine();
        Console.WriteLine(reason);
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
      return reason;
    }


    if (canvasAssignment.Name != localAssignment.Name)
    {
      var reason = $"names different for {localAssignment.Name}, local: {localAssignment.Name}, in canvas {canvasAssignment.Name}";
      if (!quiet)
        Console.WriteLine(reason);
      return reason;
    }


    var pointsSame = canvasAssignment.PointsPossible == localAssignment.PointsPossible;
    if (!pointsSame)
    {
      var reason = $"Points different for {localAssignment.Name}, local: {localAssignment.PointsPossible}, in canvas {canvasAssignment.PointsPossible}";
      if (!quiet)
        Console.WriteLine(reason);
      return reason;
    }


    var submissionTypesSame = canvasAssignment.SubmissionTypes.SequenceEqual(
      localAssignment.SubmissionTypes.Select(t => t.ToString())
    );
    if (!submissionTypesSame)
    {
      var reason = $"Submission Types different for {localAssignment.Name}, local: {JsonSerializer.Serialize(localAssignment.SubmissionTypes.Select(t => t.ToString()))}, in canvas {JsonSerializer.Serialize(canvasAssignment.SubmissionTypes)}";
      if (!quiet)
        Console.WriteLine(reason);
      return reason;
    }


    var assignmentGroupSame =
      canvasAssignmentGroupId != null
      && canvasAssignmentGroupId == canvasAssignment.AssignmentGroupId;
    if (!assignmentGroupSame)
    {
      var reason = $"Canvas assignment group ids different for {localAssignment.Name}, local: {canvasAssignmentGroupId}, in canvas {canvasAssignment.AssignmentGroupId}";
      if (!quiet)
        Console.WriteLine(reason);
      return reason;
    }

    return string.Empty;
  }

  private static string removeHtmlDetails(string canvasHtmlDescription) => canvasHtmlDescription
    .Replace("<hr />", "<hr>")
    .Replace("<br />", "<br>")
    .Replace("<br/>", "<br>")
    .Replace("<hr/>", "<hr>")
    .Replace("&gt;", "")
    .Replace("&lt;", "")
    .Replace(">", "")
    .Replace("<", "")
    .Replace("&quot;", "")
    .Replace("\"", "")
    .Replace("&amp;", "")
    .Replace("&", "");

  [GeneratedRegex("<script.*script>")]
  private static partial Regex CanvasScriptTagRegex();

  [GeneratedRegex("<link\\s+rel=\"[^\"]*\"\\s+href=\"[^\"]*\"[^>]*>")]
  private static partial Regex CanvasLinkTagRegex();
}
