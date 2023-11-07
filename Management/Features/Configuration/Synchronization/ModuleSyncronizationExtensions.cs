using CanvasModel.Modules;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class ModuleSyncronizationExtensions
{
  internal static async Task CreateAllModules(
    this LocalCourse localCourse,
    ulong canvasCourseId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    var moduleTasks = localCourse.Modules.Select(async module =>
    {
      var canvasModule = canvasModules.FirstOrDefault(cm => cm.Name == module.Name);
      if (canvasModule == null)
      {
        var newModule = await canvas.Modules.CreateModule(canvasCourseId, module.Name);
      }

      if (canvasModule?.Name != module.Name) // TODO: maybe check to see if we have name change here
      {
        await canvas.Modules.UpdateModule(canvasCourseId, canvasModule.Id, module.Name, canvasModule.Position);
      }
    });
    await Task.WhenAll(moduleTasks);
  }

  internal static async Task SortCanvasModulesByLocalOrder(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasModule> canvasModules,
    CanvasService canvas
  )
  {
    var currentCanvasPositions = canvasModules.ToDictionary(m => m.Id, m => m.Position);
    foreach (var (localModule, i) in localCourse.Modules.Select((m, i) => (m, i)))
    {

      uint correctPosition = (uint)(i + 1);
      var canvasModule = canvasModules.FirstOrDefault(c => c.Name == localModule.Name) ?? throw new Exception($"error sorting canvas module, could not find canvas module with name {localModule.Name}"); ;

      var currentCanvasPosition = currentCanvasPositions[canvasModule.Id];
      if (currentCanvasPosition != correctPosition)
      {
        await canvas.Modules.UpdateModule(canvasId, canvasModule.Id, localModule.Name, correctPosition);
      }
    }
  }

  public static async Task SortModuleItems(
    this LocalModule localModule,
    ulong canvasId,
    ulong moduleCanvasId,
    CanvasService canvas
  )
  {

    var canvasModuleItems = await canvas.Modules.GetModuleItems(canvasId, moduleCanvasId);
    var moduleItemsInCorrectOrder = canvasModuleItems
      .OrderBy(i => i.ContentDetails?.DueAt)
      .Select((a, i) => (Item: a, Position: i + 1));
    // var localItemsWithCorrectOrder = localModule.Assignments
    //   .OrderBy(a => a.DueAt)
    //   .Select((a, i) => (Assignment: a, Position: i + 1));

    // var canvasContentIdsByCurrentPosition =
    //   canvasModuleItems.ToDictionary(item => item.Position, item => item.ContentId)
    //   ?? new Dictionary<int, ulong?>();

    foreach (var (moduleItem, position) in moduleItemsInCorrectOrder)
    {
      var itemIsInCorrectOrder = moduleItem.Position == position;

      // var currentCanvasItem = canvasModuleItems.First(i => i.ContentId == moduleItem.CanvasId);
      if (!itemIsInCorrectOrder)
      {
        await canvas.UpdateModuleItem(
          canvasId,
          moduleCanvasId,
          moduleItem with
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
    CanvasModule canvasModule,
    Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> canvasModulesItems,
    CanvasService canvas
  )
  {
    var anyUpdated = false;
    foreach (var localAssignment in localModule.Assignments.Where(a => a.DueAt > DateTime.Now))
    {
      var canvasModuleItemContentIds = canvasModulesItems[canvasModule].Select(i => i.ContentId);
      if (!canvasModuleItemContentIds.Contains(localAssignment.CanvasId))
      {
        var canvasAssignmentId =
          localAssignment.CanvasId
          ?? throw new Exception("cannot create module item if assignment does not have canvas id");
        await canvas.CreateModuleItem(
          canvasId,
          canvasModule.Id,
          localAssignment.Name,
          "Assignment",
          canvasAssignmentId
        );
        anyUpdated = true;
      }
    }

    return anyUpdated;
  }

  internal static async Task SyncModuleItemsWithCanvas(
    this LocalCourse localCourse,
    ulong courseCanvasId,
    Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> canvasModulesItems,
    CanvasService canvas
  )
  {
    foreach (var localModule in localCourse.Modules)
    {
      // var moduleCanvasId =
      //   localModule.CanvasId
      // ?? throw new Exception("cannot sync canvas modules items if module not synced with canvas");
      await localModule.SyncAndSortCanvasModule(courseCanvasId, canvasModulesItems, canvas);
    }
  }

  public static async Task SyncAndSortCanvasModule(
    this LocalModule localModule,
    ulong courseCanvasId, 
    Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> canvasModulesItems, 
    CanvasService canvas
  )
  {
    var canvasModule = canvasModulesItems.Keys.FirstOrDefault(k => k.Name == localModule.Name);
    if (canvasModule == null)
    {
      throw new Exception($"cannot sync module items in canvas, could not find module with name ${localModule.Name}");
    }

    bool anyUpdated = await localModule.EnsureAllModulesItemsCreated(
      courseCanvasId,
      canvasModule,
      canvasModulesItems,
      canvas
    );

    var canvasModuleItems = anyUpdated
      ? await canvas.Modules.GetModuleItems(courseCanvasId, canvasModule.Id)
      : canvasModulesItems[canvasModule];

    await localModule.SortModuleItems(courseCanvasId, canvasModule.Id, canvas);
  }
}
