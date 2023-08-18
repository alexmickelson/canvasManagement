using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class ModuleSyncronizationExtensions
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
  internal static async Task SortModuleItems(
    this LocalModule localModule,
    ulong canvasId,
    ulong moduleCanvasId,
    IEnumerable<CanvasModuleItem> canvasModuleItems,
    CanvasService canvas
  )
  {
    var localItemsWithCorrectOrder = localModule.Assignments
      .OrderBy(a => a.DueAt)
      .Select((a, i) => (Assignment: a, Position: i + 1));

    var canvasContentIdsByCurrentPosition =
      canvasModuleItems.ToDictionary(item => item.Position, item => item.ContentId)
      ?? new Dictionary<int, ulong?>();

    foreach (var (localAssignment, position) in localItemsWithCorrectOrder)
    {
      var itemIsInCorrectOrder =
        canvasContentIdsByCurrentPosition.ContainsKey(position)
        && canvasContentIdsByCurrentPosition[position] == localAssignment.CanvasId;

      var currentCanvasItem = canvasModuleItems.First(i => i.ContentId == localAssignment.CanvasId);
      if (!itemIsInCorrectOrder)
      {
        await canvas.UpdateModuleItem(
          canvasId,
          moduleCanvasId,
          currentCanvasItem with
          {
            Position = position
          }
        );
      }
    }
  }

  internal static async Task<bool> EnsureAllModulesItemsCreated(
    this LocalModule localModule,
    ulong canvasId,
    ulong moduleCanvasId,
    Dictionary<ulong, IEnumerable<CanvasModuleItem>> canvasModulesItems,
    CanvasService canvas
  )
  {
    var anyUpdated = false;
    foreach (var localAssignment in localModule.Assignments)
    {
      var canvasModuleItemContentIds = canvasModulesItems[moduleCanvasId].Select(i => i.ContentId);
      if (!canvasModuleItemContentIds.Contains(localAssignment.CanvasId))
      {
        var canvasAssignmentId =
          localAssignment.CanvasId
          ?? throw new Exception("cannot create module item if assignment does not have canvas id");
        await canvas.CreateModuleItem(
          canvasId,
          moduleCanvasId,
          localAssignment.Name,
          "Assignment",
          canvasAssignmentId
        );
        anyUpdated = true;
      }
    }

    foreach(var localQuiz in localModule.Quizzes)
    {
      
      var canvasModuleItemContentIds = canvasModulesItems[moduleCanvasId].Select(i => i.ContentId);
      if (!canvasModuleItemContentIds.Contains(localQuiz.CanvasId))
      {
        var canvasAssignmentId =
          localQuiz.CanvasId
          ?? throw new Exception("cannot create module item if assignment does not have canvas id");
        await canvas.CreateModuleItem(
          canvasId,
          moduleCanvasId,
          localQuiz.Name,
          "Quiz",
          canvasAssignmentId
        );
        anyUpdated = true;
      }
    }

    return anyUpdated;
  }

  internal static async Task SyncModuleItemsWithCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    Dictionary<ulong, IEnumerable<CanvasModuleItem>> canvasModulesItems,
    CanvasService canvas
  )
  {
    foreach (var localModule in localCourse.Modules)
    {
      var moduleCanvasId =
        localModule.CanvasId
        ?? throw new Exception("cannot sync canvas modules items if module not synced with canvas");

      bool anyUpdated = await localModule.EnsureAllModulesItemsCreated(
        canvasId,
        moduleCanvasId,
        canvasModulesItems,
        canvas
      );

      var canvasModuleItems = anyUpdated
        ? await canvas.GetModuleItems(canvasId, moduleCanvasId)
        : canvasModulesItems[moduleCanvasId];

      await localModule.SortModuleItems(canvasId, moduleCanvasId, canvasModuleItems, canvas);
    }
  }
}
