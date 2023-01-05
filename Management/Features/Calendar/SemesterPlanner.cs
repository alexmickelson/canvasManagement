using CanvasModel.EnrollmentTerms;

public class SemesterPlanner
{
  public IEnumerable<CalendarMonth> Months { get; }
  public SemesterPlanner(EnrollmentTermModel canvasTerm)
  {
    var monthsInTerm = canvasTerm.EndAt?.Month - canvasTerm.StartAt?.Month
      ?? throw new Exception($"Canvas Term must have a start and end date. Term: {canvasTerm.Id}, start: {canvasTerm.StartAt}, end: {canvasTerm.EndAt}");

    Months = Enumerable.Range(1, monthsInTerm).Select(_ => new CalendarMonth());
  }
}