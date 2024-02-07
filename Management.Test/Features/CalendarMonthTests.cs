public class CalendarMonthTests
{
  [Test]
  public void TestCalendarMonthCanGetFirstWeek()
  {
    var month = new CalendarMonth(2023, 2);

    int?[] expectedFirstWeek = new int?[] {
      null, null, null, 1, 2, 3, 4
    };

    month.Weeks.First().Should().BeEquivalentTo(expectedFirstWeek);
  }

  [Test]
  public void TestCanGetAnotherMonthsFirstWeek()
  {
    var month = new CalendarMonth(2023, 4);

    int?[] expectedFirstWeek = new int?[] {
      null, null, null, null, null, null, 1
    };

    month.Weeks.First().Should().BeEquivalentTo(expectedFirstWeek);
  }

  [Test]
  public void TestCorrectNumberOfWeeks()
  {
    var month = new CalendarMonth(2023, 4);

    month.Weeks.Count().Should().Be(6);
  }

  [Test]
  public void TestLastWeekIsCorrect()
  {
    var month = new CalendarMonth(2023, 4);
    int?[] expectedLastWeek = new int?[] {
      30, null, null, null, null, null, null,
    };

    month.Weeks.Last().Should().BeEquivalentTo(expectedLastWeek);
  }
}
