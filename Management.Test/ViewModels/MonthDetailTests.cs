using Management.Web.Shared.Semester;

public class MonthDetailTests
{
  [Test]
  public void TestCanGetMonthName()
  {
    var detail = new MonthDetail();
    var calendarMonth = new CalendarMonth(2022, 2);
    detail.Month = calendarMonth;

    detail.MonthName.Should().Be("February");
  }
}