using CanvasModel.EnrollmentTerms;

public class SemesterPlanner
{
  public IEnumerable<CalendarMonth> Months { get; }
  public SemesterPlanner(SemesterConfiguration configuration)
  {
    var start = configuration.StartDate;
    var end = configuration.EndDate;

    var monthsInTerm =
      1 + ((end.Year - start.Year) * 12)
        + end.Month - start.Month;

    Months = Enumerable
      .Range(0, monthsInTerm)
      .Select(monthDiff =>
      {
        var month = ((start.Month + monthDiff - 1) % 12) + 1;
        var year = start.Year + ((start.Month + monthDiff - 1) / 12);
        return new CalendarMonth(year, month);
      });
  }
}