using CanvasModel.EnrollmentTerms;

public class ConfigurationTests
{
  [Test]
  public void TestCanCreateConfigFromTermAndDays()
  {
    DateTime startAt = new DateTime(2022, 1, 1);
    DateTime endAt = new DateTime(2022, 1, 2);
    var canvasTerm = new EnrollmentTermModel(
      Id: 1,
      Name: "one",
      StartAt: startAt,
      EndAt: endAt
    );
    var daysOfWeek = new DayOfWeek[] { DayOfWeek.Monday };
    var management = new ConfigurationManagement();
    management.SetConfiguration(canvasTerm, daysOfWeek);
    var config = management.SemesterCalendar;

    if(config == null) Assert.Fail();
    config!.StartDate.Should().Be(startAt);
    config!.EndDate.Should().Be(endAt);
    config!.Days.Should().BeEquivalentTo(daysOfWeek);
  }
}