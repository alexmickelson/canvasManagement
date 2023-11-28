using CanvasModel.Assignments;
using CanvasModel.Modules;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class ModuleSyncronizationExtensions
{

  // internal static async Task SortCanvasModulesByLocalOrder(
  //   this LocalCourse localCourse,
  //   ulong canvasId,
  //   IEnumerable<CanvasModule> canvasModules,
  //   CanvasService canvas
  // )
  // {
  //   var currentCanvasPositions = canvasModules.ToDictionary(m => m.Id, m => m.Position);
  //   foreach (var (localModule, i) in localCourse.Modules.Select((m, i) => (m, i)))
  //   {

  //     uint correctPosition = (uint)(i + 1);
  //     var canvasModule = canvasModules.FirstOrDefault(c => c.Name == localModule.Name) ?? throw new Exception($"error sorting canvas module, could not find canvas module with name {localModule.Name}"); ;

  //     var currentCanvasPosition = currentCanvasPositions[canvasModule.Id];
  //     if (currentCanvasPosition != correctPosition)
  //     {
  //       await canvas.Modules.UpdateModule(canvasId, canvasModule.Id, localModule.Name, correctPosition);
  //     }
  //   }
  // }

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

    foreach (var (moduleItem, position) in moduleItemsInCorrectOrder)
    {
      var itemIsInCorrectOrder = moduleItem.Position == position;

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
    CanvasService canvas,
    IEnumerable<CanvasAssignment> canvasAssignments
  )
  {
    var anyUpdated = false;
    foreach (var localAssignment in localModule.Assignments.Where(a => a.DueAt > DateTime.Now))
    {
      var canvasModuleItemContentNames = canvasModulesItems[canvasModule].Select(i => i.Title);
      if (!canvasModuleItemContentNames.Contains(localAssignment.Name))
      {
        var canvasAssignment = canvasAssignments.FirstOrDefault(a => a.Name == localAssignment.Name)
          ?? throw new Exception($"cannot create module item if cannot find canvas assignment with name {localAssignment.Name}");

        await canvas.CreateModuleItem(
          canvasId,
          canvasModule.Id,
          localAssignment.Name,
          "Assignment",
          canvasAssignment.Id
        );
        anyUpdated = true;
      }
    }

    return anyUpdated;
  }

}
