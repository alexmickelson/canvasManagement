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

  public static LocalAssignment validateSubmissionTypes(this LocalAssignment assignment)
  {
    var containsDiscussion =
      assignment.SubmissionTypes.FirstOrDefault(t => t == AssignmentSubmissionType.DISCUSSION_TOPIC) != null;

    if (containsDiscussion)
      return assignment with { SubmissionTypes = new string[] { AssignmentSubmissionType.DISCUSSION_TOPIC } };
    return assignment;
  }

  public static LocalAssignment validateDates(this LocalAssignment assignment)
  {
    var dueAt = assignment.DueAt.AddMilliseconds(0).AddMilliseconds(0);
    var lockAt = assignment.LockAt?.AddMilliseconds(0).AddMilliseconds(0);
    return assignment with
    {
      DueAt = dueAt,
      LockAt = lockAt
    };
  }
}
