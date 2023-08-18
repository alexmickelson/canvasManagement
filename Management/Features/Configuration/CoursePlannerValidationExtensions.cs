using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
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
            .OrderBy(a => a.DueAt)
            .DistinctBy(a => a.Id)
            .Select(a => a.validateSubmissionTypes())
            .Select(a => a.validateDates())
            .ToArray()
        }
    ).ToArray();

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
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<CanvasQuiz> canvasQuizzes
  )
  {
    Console.WriteLine("checking canvas ids still exist");

    var correctedModules = localCourse.Modules
      .Select((m) => m.validateCanvasIds(canvasModules, canvasAssignments, canvasQuizzes))
      .ToArray();

    return localCourse with
    {
      Modules = correctedModules
    };
  }

  private static LocalModule validateCanvasIds(
    this LocalModule module,
    IEnumerable<CanvasModule> canvasModules,
    IEnumerable<CanvasAssignment> canvasAssignments,
    IEnumerable<CanvasQuiz> canvasQuizzes
  )
  {
    var moduleIdInCanvas = canvasModules.FirstOrDefault(m => m.Id == module.CanvasId) != null;
    var moduleWithAssignments = module with
    {
      Assignments = module.Assignments
        .Select((a) => a.validateAssignmentForCanvasId(canvasAssignments))
        .ToArray(),
      Quizzes = module.Quizzes.Select((s) => s.validateQuizForCanvasId(canvasQuizzes)).ToArray()
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
  private static LocalQuiz validateQuizForCanvasId(
    this LocalQuiz quiz,
    IEnumerable<CanvasQuiz> canvasQuizzes
  )
  {
    var assignmentIdInCanvas =
      canvasQuizzes.FirstOrDefault(cq => cq.Id == quiz.CanvasId) != null;
    if (!assignmentIdInCanvas)
    {
      Console.WriteLine(
        $"no id in canvas for quiz, removing old canvas id: {quiz.Name}"
      );
      return quiz with { CanvasId = null };
    }
    return quiz;
  }

  public static LocalAssignment validateSubmissionTypes(this LocalAssignment assignment)
  {
    var containsDiscussion =
      assignment.SubmissionTypes.FirstOrDefault(t => t == SubmissionType.DISCUSSION_TOPIC) != null;

    if (containsDiscussion)
      return assignment with
      {
        SubmissionTypes = new string[] { SubmissionType.DISCUSSION_TOPIC }
      };
    return assignment;
  }

    public static LocalAssignment validateDates(this LocalAssignment assignment)
    {
      return assignment with 
      {
        DueAt=assignment.DueAt.AddMilliseconds(0).AddMilliseconds(0),
        LockAt=assignment.LockAt?.AddMilliseconds(0).AddMilliseconds(0)
      };
    }
}
