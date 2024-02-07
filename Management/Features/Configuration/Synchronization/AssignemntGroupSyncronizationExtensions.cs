using CanvasModel.Assignments;
using CanvasModel.Modules;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class AssignmentGroupSyncronizationExtensions
{
  internal static async Task<IEnumerable<LocalAssignmentGroup>> EnsureAllAssignmentGroupsExistInCanvas(
    this LocalCourse localCourse,
    ulong courseCanvasId,
    IEnumerable<CanvasAssignmentGroup> canvasAssignmentGroups,
    CanvasService canvas
  )
  {
    var canvasAssignmentGroupIds = canvasAssignmentGroups.Select(g => g.Id).ToArray();
    var assignmentGroups = await Task.WhenAll((Task<LocalAssignmentGroup>[])localCourse.Settings.AssignmentGroups.Select(
      async assignmentGroup =>
      {
        var canvasGroupWithSameName = canvasAssignmentGroups.FirstOrDefault(
          cg => cg.Name.Equals(assignmentGroup.Name)
        );
        if (canvasGroupWithSameName == null)
          return await canvas.AssignmentGroups.Create(courseCanvasId, assignmentGroup);

        var correctGroup = assignmentGroup with { CanvasId = canvasGroupWithSameName.Id };

        var needsUpdate = canvasGroupWithSameName.GroupWeight != correctGroup.Weight;

        if (needsUpdate)
          await canvas.AssignmentGroups.Update(courseCanvasId, correctGroup);

        return correctGroup;
      }
    ).ToArray());

    return assignmentGroups;
  }
}
