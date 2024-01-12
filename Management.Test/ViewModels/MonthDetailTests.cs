using Management.Web.Pages.Course.CourseCalendar;

public class MonthDetailTests
{
  [Test]
  public void TestCanGetMonthName()
  {
    var calendarMonth = new CalendarMonth(2022, 2);
    var detail = new MonthDetail()
    {
      Month = calendarMonth
    };

    detail.MonthName.Should().Be("February");
  }
}
