using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static class CoursePlannerSyncronizationExtensions
{
  internal static async Task EnsureAllModulesExistInCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    foreach (var module in localCourse.Modules)
    {
      var canvasModule = canvasModules.FirstOrDefault(cm => cm.Id == module.CanvasId);
      if (canvasModule == null)
      {
        await canvas.CreateModule(canvasId, module.Name);
      }
    }
  }

  internal static async Task SortCanvasModules(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    var currentCanvasPositions = canvasModules.ToDictionary(m => m.Id, m => m.Position);
    foreach (var (localModule, i) in localCourse.Modules.Select((m, i) => (m, i)))
    {
      var correctPosition = i + 1;
      var moduleCanvasId =
        localModule.CanvasId ?? throw new Exception("cannot sort module if no module canvas id");
      var currentCanvasPosition = currentCanvasPositions[moduleCanvasId];
      if (currentCanvasPosition != correctPosition)
      {
        await canvas.UpdateModule(canvasId, moduleCanvasId, localModule.Name, correctPosition);
      }
    }
  }

  internal static async Task<LocalCourse> SyncModulesWithCanvasData(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    canvasModules = await canvas.GetModules(canvasId);
    return localCourse with
    {
      Modules = localCourse.Modules.Select(m =>
      {
        var canvasModule = canvasModules.FirstOrDefault(cm => cm.Name == m.Name);
        return canvasModule == null ? m : m with { CanvasId = canvasModule.Id };
      })
    };
  }

  internal static async Task<LocalAssignment> SyncToCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    CanvasService canvas
  )
  {
    var canvasAssignment = canvasAssignments.FirstOrDefault(
      ca => ca.Id == localAssignment.canvasId
    );
    string localHtmlDescription = localAssignment.GetDescriptionHtml(
      localCourse.AssignmentTemplates
    );

    if (canvasAssignment != null)
    {
      var assignmentNeedsUpdates = localAssignment.NeedsUpdates(
        canvasAssignments,
        localCourse.AssignmentTemplates,
        quiet: false
      );
      if (assignmentNeedsUpdates)
      {
        await canvas.Assignments.Update(courseId: canvasId, localAssignment, localHtmlDescription);
      }
      return localAssignment;
    }
    else
    {
      return await canvas.Assignments.Create(canvasId, localAssignment, localHtmlDescription);
    }
  }

  public static bool NeedsUpdates(
    this LocalAssignment localAssignment,
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<AssignmentTemplate> courseAssignmentTemplates,
    bool quiet = true
  )
  {
    var canvasAssignment = canvasAssignments.First(ca => ca.Id == localAssignment.canvasId);

    var localHtmlDescription = localAssignment.GetDescriptionHtml(courseAssignmentTemplates);

    var canvasHtmlDescription = canvasAssignment.Description;
    canvasHtmlDescription = Regex.Replace(canvasHtmlDescription, "<script.*script>", "");
    canvasHtmlDescription = Regex.Replace(canvasHtmlDescription, "<link .*\">", "");

    var dueDatesSame = canvasAssignment.DueAt == localAssignment.due_at;
    var descriptionSame = canvasHtmlDescription == localHtmlDescription;
    var nameSame = canvasAssignment.Name == localAssignment.name;
    var lockDateSame = canvasAssignment.LockAt == localAssignment.lock_at;
    var pointsSame = canvasAssignment.PointsPossible == localAssignment.points_possible;
    var submissionTypesSame = canvasAssignment.SubmissionTypes.SequenceEqual(
      localAssignment.submission_types.Select(t => t.ToString())
    );

    if (!quiet)
    {
      if (!dueDatesSame)
        Console.WriteLine(
          $"Due dates different for {localAssignment.name}, local: {localAssignment.due_at}, in canvas {canvasAssignment.DueAt}"
        );

      if (!descriptionSame)
      {
        Console.WriteLine($"descriptions different for {localAssignment.name}");
        Console.WriteLine("Local Description:");
        Console.WriteLine(localHtmlDescription);
        Console.WriteLine("Canvas Description: ");
        Console.WriteLine(canvasHtmlDescription);
      }

      if (!nameSame)
        Console.WriteLine(
          $"names different for {localAssignment.name}, local: {localAssignment.name}, in canvas {canvasAssignment.Name}"
        );
      if (!lockDateSame)
        Console.WriteLine(
          $"Lock Dates different for {localAssignment.name}, local: {localAssignment.lock_at}, in canvas {canvasAssignment.LockAt}"
        );
      if (!pointsSame)
        Console.WriteLine(
          $"Points different for {localAssignment.name}, local: {localAssignment.points_possible}, in canvas {canvasAssignment.PointsPossible}"
        );
      if (!submissionTypesSame)
        Console.WriteLine(
          $"Submission Types different for {localAssignment.name}, local: {JsonSerializer.Serialize(localAssignment.submission_types.Select(t => t.ToString()))}, in canvas {JsonSerializer.Serialize(canvasAssignment.SubmissionTypes)}"
        );
    }

    return !nameSame
      || !dueDatesSame
      || !lockDateSame
      || !descriptionSame
      || !pointsSame
      || !submissionTypesSame;
  }

  internal static async Task<LocalCourse> SyncAssignmentsWithCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasAssignment> canvasAssignments,
    CanvasService canvas
  )
  {
    var moduleTasks = localCourse.Modules.Select(async m =>
    {
      var assignmentTasks = m.Assignments.Select(
        (a) => localCourse.SyncToCanvas(canvasId, a, canvasAssignments, canvas)
      );
      var assignments = await Task.WhenAll(assignmentTasks);
      return m with { Assignments = assignments };
    });

    var modules = await Task.WhenAll(moduleTasks);
    return localCourse with { Modules = modules };
  }
}
