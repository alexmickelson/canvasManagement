using CanvasModel.EnrollmentTerms;

public class SemesterPlanner
{
  public DateTime FirstDay { get; }
  public DateTime LastDay { get; }

  public IEnumerable<CalendarMonth> Months { get; }
  public IEnumerable<DayOfWeek> Days { get; }
  public SemesterPlanner(SemesterCalendarConfig configuration)
  {
    FirstDay = configuration.StartDate;
    LastDay = configuration.EndDate;

    var monthsInTerm =
      1 + ((LastDay.Year - FirstDay.Year) * 12)
        + LastDay.Month - FirstDay.Month;

    Months = Enumerable
      .Range(0, monthsInTerm)
      .Select(monthDiff =>
      {
        var month = ((FirstDay.Month + monthDiff - 1) % 12) + 1;
        var year = FirstDay.Year + ((FirstDay.Month + monthDiff - 1) / 12);
        return new CalendarMonth(year, month);
      });
    Days = configuration.Days;
  }
}