using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;

namespace Management.Planner;

public static class CoursePlannerExtensions
{
  public static LocalCourse GeneralCourseCleanup(this LocalCourse incomingCourse)
  {
    var cleanModules = incomingCourse.Modules
      .Select(
        module =>
          module with
          {
            Assignments = module.Assignments
              .OrderBy(a => a.DueAt)
              .Select(a => a.validateSubmissionTypes())
              .Select(a => a.validateDates())
              .ToArray()
          }
      )
      .ToArray();

    var cleanStartDay = new DateTime(
      incomingCourse.Settings.StartDate.Year,
      incomingCourse.Settings.StartDate.Month,
      incomingCourse.Settings.StartDate.Day
    );
    var cleanEndDay = new DateTime(
      incomingCourse.Settings.EndDate.Year,
      incomingCourse.Settings.EndDate.Month,
      incomingCourse.Settings.EndDate.Day
    );

    return incomingCourse with
    {
      Modules = cleanModules,
      Settings = incomingCourse.Settings with
      {
        StartDate = cleanStartDay,
        EndDate = cleanEndDay,
      }
    };
  }

  public static LocalCourse deleteCanvasIdsThatNoLongerExist(
    this LocalCourse localCourse,
    IEnumerable<CanvasModule> canvasModules,
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<CanvasAssignmentGroup> canvasAssignmentGroups,
    IEnumerable<CanvasQuiz> canvasQuizzes
  )
  {
    Console.WriteLine("checking canvas ids still exist");

    var correctedModules = localCourse.Modules
      .Select((m) => m.validateCanvasIds(canvasModules, canvasAssignments, canvasQuizzes))
      .ToArray();

    var canvasAssignmentGroupIds = canvasAssignmentGroups.Select(g => g.Id).ToArray();
    var correctAssignmentGroups = localCourse.Settings.AssignmentGroups.Select(
      g =>
      {
        var groupCanvasId = g.CanvasId ?? 0;
        return canvasAssignmentGroupIds.Contains(groupCanvasId)
          ? g
          : g with { CanvasId = null };
      }
    ).ToArray();

    return localCourse with
    {
      Modules = correctedModules,
      Settings = localCourse.Settings with
      {
        AssignmentGroups = correctAssignmentGroups,
      }
    };
  }

  private static LocalModule validateCanvasIds(
    this LocalModule module,
    IEnumerable<CanvasModule> canvasModules,
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<CanvasQuiz> canvasQuizzes
  )
  {
    var moduleIdInCanvas = canvasModules.FirstOrDefault(m => m.Name == module.Name) != null;
    var moduleWithAssignments = module with
    {
      Assignments = module.Assignments
        .Select((a) => a.validateAssignmentForCanvasId(canvasAssignments))
        .ToArray(),
    };

    if (!moduleIdInCanvas)
    {
      Console.WriteLine(
        $"no id in canvas for module, removing old canvas id: {moduleWithAssignments.Name}"
      );
      return moduleWithAssignments;
    }
    return moduleWithAssignments;
  }

  private static LocalAssignment validateAssignmentForCanvasId(
    this LocalAssignment assignment,
    IEnumerable<CanvasAssignment> canvasAssignments
  )
  {
    var assignmentIdInCanvas =
      canvasAssignments.FirstOrDefault(ca => ca.Id == assignment.CanvasId) != null;
    if (!assignmentIdInCanvas)
    {
      Console.WriteLine(
        $"no id in canvas for assignment, removing old canvas id: {assignment.Name}"
      );
      return assignment with { CanvasId = null };
    }
    return assignment;
  }

  public static LocalAssignment validateSubmissionTypes(this LocalAssignment assignment)
  {
    var containsDiscussion =
      assignment.SubmissionTypes.FirstOrDefault(t => t == SubmissionType.DISCUSSION_TOPIC) != null;

    if (containsDiscussion)
      return assignment with { SubmissionTypes = new string[] { SubmissionType.DISCUSSION_TOPIC } };
    return assignment;
  }

  public static LocalAssignment validateDates(this LocalAssignment assignment)
  {
    var dueAt = assignment.DueAt.AddMilliseconds(0).AddMilliseconds(0);
    var lockAt = assignment.LockAt?.AddMilliseconds(0).AddMilliseconds(0);
    return assignment with
    {
      DueAt = dueAt,
      LockAt = assignment.LockAtDueDate ? dueAt : lockAt
    };
  }
}
