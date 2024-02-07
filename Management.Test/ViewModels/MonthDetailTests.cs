using Management.Web.Pages.Course.CourseCalendar;

public class MonthDetailTests
{
  [Test]
  public void TestCanGetMonthName()
  {
    var calendarMonth = new CalendarMonth(2022, 2);

#pragma warning disable BL0005 // Component parameter should not be set outside of its component.
    var detail = new MonthDetail()
    {
      Month = calendarMonth
    };
#pragma warning restore BL0005 // Component parameter should not be set outside of its component.


    detail.MonthName.Should().Be("February");
  }
}
