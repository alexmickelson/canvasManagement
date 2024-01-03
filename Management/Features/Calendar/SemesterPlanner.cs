using CanvasModel.EnrollmentTerms;

public class SemesterPlanner
{
  public static IEnumerable<CalendarMonth> GetMonthsBetweenDates(
    DateTime startDate,
    DateTime endDate
  )
  {
    var monthsInTerm = 1 + ((endDate.Year - startDate.Year) * 12) + endDate.Month - startDate.Month;

    return Enumerable
      .Range(0, monthsInTerm)
      .Select(monthDiff =>
      {
        var month = ((startDate.Month + monthDiff - 1) % 12) + 1;
        var year = startDate.Year + ((startDate.Month + monthDiff - 1) / 12);

        return new CalendarMonth(year, month);
      });
  }
}
