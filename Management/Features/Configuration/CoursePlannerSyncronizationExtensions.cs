using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class CoursePlannerSyncronizationExtensions
{
  internal static async Task<IEnumerable<LocalModule>> EnsureAllModulesExistInCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    var moduleTasks = localCourse.Modules.Select(async module =>
    {
      var canvasModule = canvasModules.FirstOrDefault(cm => cm.Id == module.CanvasId);
      if (canvasModule == null)
      {
        var newModule = await canvas.CreateModule(canvasId, module.Name);
        return module with { CanvasId = newModule.Id };
      }
      else
        return module;
    });
    var newModules = await Task.WhenAll(moduleTasks);
    return newModules ?? throw new Exception("Error ensuring all modules exist in canvas");
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
      ca => ca.Id == localAssignment.CanvasId
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
    var canvasAssignment = canvasAssignments.First(ca => ca.Id == localAssignment.CanvasId);

    var localHtmlDescription = localAssignment
      .GetDescriptionHtml(courseAssignmentTemplates)
      .Replace("&gt;", "")
      .Replace("&lt;", "")
      .Replace(">", "")
      .Replace("<", "");

    var canvasHtmlDescription = canvasAssignment.Description;
    canvasHtmlDescription = CanvasScriptTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = CanvasLinkTagRegex().Replace(canvasHtmlDescription, "");
    canvasHtmlDescription = canvasHtmlDescription
      .Replace("&gt;", "")
      .Replace("&lt;", "")
      .Replace(">", "")
      .Replace("<", "");

    var dueDatesSame =
      canvasAssignment.DueAt != null
      && new DateTime(
        year: canvasAssignment.DueAt.Value.Year,
        month: canvasAssignment.DueAt.Value.Month,
        day: canvasAssignment.DueAt.Value.Day,
        hour: canvasAssignment.DueAt.Value.Hour,
        minute: canvasAssignment.DueAt.Value.Minute,
        second: canvasAssignment.DueAt.Value.Second
      )
        == new DateTime(
          year: localAssignment.DueAt.Year,
          month: localAssignment.DueAt.Month,
          day: localAssignment.DueAt.Day,
          hour: localAssignment.DueAt.Hour,
          minute: localAssignment.DueAt.Minute,
          second: localAssignment.DueAt.Second
        );

    var descriptionSame = canvasHtmlDescription == localHtmlDescription;
    var nameSame = canvasAssignment.Name == localAssignment.Name;
    var lockDateSame = canvasAssignment.LockAt == localAssignment.LockAt;
    var pointsSame = canvasAssignment.PointsPossible == localAssignment.PointsPossible;
    var submissionTypesSame = canvasAssignment.SubmissionTypes.SequenceEqual(
      localAssignment.SubmissionTypes.Select(t => t.ToString())
    );

    if (!quiet)
    {
      if (!dueDatesSame)
      {
        Console.WriteLine(
          $"Due dates different for {localAssignment.Name}, local: {localAssignment.DueAt}, in canvas {canvasAssignment.DueAt}"
        );
        Console.WriteLine(JsonSerializer.Serialize(localAssignment.DueAt));
        Console.WriteLine(JsonSerializer.Serialize(canvasAssignment.DueAt));
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
      if (!lockDateSame)
        Console.WriteLine(
          $"Lock Dates different for {localAssignment.Name}, local: {localAssignment.LockAt}, in canvas {canvasAssignment.LockAt}"
        );
      if (!pointsSame)
        Console.WriteLine(
          $"Points different for {localAssignment.Name}, local: {localAssignment.PointsPossible}, in canvas {canvasAssignment.PointsPossible}"
        );
      if (!submissionTypesSame)
        Console.WriteLine(
          $"Submission Types different for {localAssignment.Name}, local: {JsonSerializer.Serialize(localAssignment.SubmissionTypes.Select(t => t.ToString()))}, in canvas {JsonSerializer.Serialize(canvasAssignment.SubmissionTypes)}"
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

  [GeneratedRegex("<script.*script>")]
  private static partial Regex CanvasScriptTagRegex();

  [GeneratedRegex("<link\\s+rel=\"[^\"]*\"\\s+href=\"[^\"]*\"[^>]*>")]
  private static partial Regex CanvasLinkTagRegex();
}
