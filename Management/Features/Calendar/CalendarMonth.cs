public class CalendarMonth
{
  private DateOnly firstDay { get; }
  private int year { get => firstDay.Year; }
  private int month { get => firstDay.Month; }
  public IEnumerable<IEnumerable<int?>> Weeks
  {
    get =>
      DaysByWeek.Select(
        week => week.Select(d => d?.Day)
      );

  }

  public IEnumerable<IEnumerable<DateTime?>> DaysByWeek
  {
    get
    {
      var weeks = new List<List<DateTime?>>();
      var weeksInMonth = WeeksInMonth(year, month);
      var daysInMonth = DateTime.DaysInMonth(year, month);

      var firstDayOfMonth = new DateTime(year, month, 1).DayOfWeek;

      var currentDay = 1;
      for (int i = 0; i < weeksInMonth; i++)
      {
        var thisWeek = new List<DateTime?>();
        if (i == 0 && firstDayOfMonth != DayOfWeek.Sunday)
        {
          for (int j = 0; j < 7; j++)
          {
            if (j < (int)firstDayOfMonth)
            {
              thisWeek.Add(null);
            }
            else
            {
              thisWeek.Add(new DateTime(year, month, currentDay));
              currentDay++;
            }
          }
        }
        else
        {
          for (int j = 0; j < 7; j++)
          {
            if (currentDay <= daysInMonth)
            {
              thisWeek.Add(new DateTime(year, month, currentDay));
              currentDay++;
            }
            else
            {
              thisWeek.Add(null);
            }
          }
        }
        weeks.Add(thisWeek);
      }
      return weeks;
    }
  }

  public static int WeeksInMonth(int year, int month)
  {
    var firstDayOfMonth = new DateTime(year, month, 1).DayOfWeek;
    var daysInMonth = DateTime.DaysInMonth(year, month);
    var longDaysInMonth = daysInMonth + (int)(firstDayOfMonth);
    var weeks = longDaysInMonth / 7;
    if ((longDaysInMonth % 7) > 0)
    {
      weeks += 1;
    }
    return weeks;
  }

  public CalendarMonth(int year, int month)
  {
    firstDay = new DateOnly(year, month, 1);

  }
}