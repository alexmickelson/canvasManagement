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
}
