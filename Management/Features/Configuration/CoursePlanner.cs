using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;

public class CoursePlanner
{
  public void SetConfiguration(EnrollmentTermModel canvasTerm, DayOfWeek[] daysOfWeek)
  {
    var start =
      canvasTerm.StartAt
      ?? throw new Exception($"Canvas Term must have a start date. Term: {canvasTerm.Name}");
    var end =
      canvasTerm.EndAt
      ?? throw new Exception($"Canvas Term must have a end date. Term: {canvasTerm.Name}");

    SemesterCalendar = new SemesterCalendarConfig(StartDate: start, EndDate: end, Days: daysOfWeek);
  }

  public SemesterCalendarConfig? SemesterCalendar { get; set; } = null;

  public IEnumerable<CourseModule> Modules { get; set; } = new CourseModule[] { };
  public IEnumerable<LocalAssignment> Assignments { get; set; } = new LocalAssignment[] { };
  public CourseModel? Course { get; set; } = null;
}
