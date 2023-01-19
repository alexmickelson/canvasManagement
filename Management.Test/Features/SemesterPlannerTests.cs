using CanvasModel.EnrollmentTerms;

namespace Management.Test;

public class SemesterPlannerTests
{
  [Test]
  public void TestCanCreatePlanner()
  {

    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 1, 1),
      EndDate: new DateTime(2022, 1, 2),
      new DayOfWeek[] { }
    );

    var semester = new SemesterPlanner(config);

    semester.Months.Count().Should().Be(1);
  }

  [Test]
  public void TestNewPlannerHasCorrectNumberOfMonths()
  {
    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 1, 1),
      EndDate: new DateTime(2022, 2, 1),
      new DayOfWeek[] { }
    );

    var semester = new SemesterPlanner(config);

    semester.Months.Count().Should().Be(2);
  }

  [Test]
  public void TestNewPlannerHandlesTermsThatWrapYears()
  {
    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 12, 1),
      EndDate: new DateTime(2023, 1, 1),
      new DayOfWeek[] { }
    );

    var semester = new SemesterPlanner(config);

    semester.Months.Count().Should().Be(2);
  }

  [Test]
  public void TestSemesterGetsCorrectMonths()
  {
    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 1, 1),
      EndDate: new DateTime(2022, 2, 1),
      new DayOfWeek[] { }
    );

    var semester = new SemesterPlanner(config);

    semester.Months.First().Month.Should().Be(1);
    semester.Months.Last().Month.Should().Be(2);
  }


  [Test]
  public void TestMonthsCanWrapYears()
  {
    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 12, 1),
      EndDate: new DateTime(2023, 1, 1),
      new DayOfWeek[] { }
    );

    var semester = new SemesterPlanner(config);

    semester.Months.First().Month.Should().Be(12);
    semester.Months.First().Year.Should().Be(2022);

    semester.Months.Last().Month.Should().Be(1);
    semester.Months.Last().Year.Should().Be(2023);
  }

  [Test]
  public void TestSemesterTracksDaysOfWeek()
  {
    DayOfWeek[] days = new DayOfWeek[] { DayOfWeek.Monday };
    var config = new SemesterConfiguration(
      StartDate: new DateTime(2022, 12, 1),
      EndDate: new DateTime(2023, 1, 1),
      days
    );

    var semester = new SemesterPlanner(config);
    semester.Days.Should().BeEquivalentTo(days);
  }
}