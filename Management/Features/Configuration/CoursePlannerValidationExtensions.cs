using CanvasModel.Assignments;
using CanvasModel.Modules;
using LocalModels;

namespace Management.Planner;

public static class CoursePlannerExtensions
{
  public static LocalCourse GeneralCourseCleanup(this LocalCourse incomingCourse)
  {
    var cleanModules = incomingCourse.Modules.Select(
      module =>
        module with
        {
          Assignments = module.Assignments
            .OrderBy(a => a.due_at)
            .DistinctBy(a => a.id)
            .Select(a => a.validateSubmissionTypes())
        }
    );

    var cleanStartDay = new DateTime(
      incomingCourse.StartDate.Year,
      incomingCourse.StartDate.Month,
      incomingCourse.StartDate.Day
    );
    var cleanEndDay = new DateTime(
      incomingCourse.EndDate.Year,
      incomingCourse.EndDate.Month,
      incomingCourse.EndDate.Day
    );

    return incomingCourse with
    {
      Modules = cleanModules,
      StartDate = cleanStartDay,
      EndDate = cleanEndDay,
    };
  }

  public static LocalCourse deleteCanvasIdsThatNoLongerExist(
    this LocalCourse localCourse,
    IEnumerable<CanvasModule> canvasModules,
    IEnumerable<CanvasAssignment> canvasAssignments
  )
  {
    Console.WriteLine("checking canvas ids still exist");

    var correctedModules = localCourse.Modules
      .Select((m) => m.validateCanvasIds(canvasModules, canvasAssignments))
      .ToArray();

    return localCourse with
    {
      Modules = correctedModules
    };
  }

  private static LocalModule validateCanvasIds(
    this LocalModule module,
    IEnumerable<CanvasModule> canvasModules,
    IEnumerable<CanvasAssignment> canvasAssignments
  )
  {
    var moduleIdInCanvas = canvasModules.FirstOrDefault(m => m.Id == module.CanvasId) != null;
    var moduleWithAssignments = module with
    {
      Assignments = module.Assignments
        .Select((a) => a.validateAssignmentForCanvasId(canvasAssignments))
        .ToArray()
    };

    if (!moduleIdInCanvas)
    {
      Console.WriteLine(
        $"no id in canvas for module, removing old canvas id: {moduleWithAssignments.Name}"
      );
      return moduleWithAssignments with { CanvasId = null };
    }
    return moduleWithAssignments;
  }

  private static LocalAssignment validateAssignmentForCanvasId(
    this LocalAssignment assignment,
    IEnumerable<CanvasAssignment> canvasAssignments
  )
  {
    var assignmentIdInCanvas =
      canvasAssignments.FirstOrDefault(ca => ca.Id == assignment.canvasId) != null;
    if (!assignmentIdInCanvas)
    {
      Console.WriteLine(
        $"no id in canvas for assignment, removing old canvas id: {assignment.name}"
      );
      return assignment with { canvasId = null };
    }
    return assignment;
  }

  public static LocalAssignment validateSubmissionTypes(this LocalAssignment assignment)
  {
    var containsDiscussion =
      assignment.submission_types.FirstOrDefault(t => t == SubmissionType.discussion_topic) != null;

    if (containsDiscussion)
      return assignment with
      {
        submission_types = new string[] { SubmissionType.discussion_topic }
      };
    return assignment;
  }
}
