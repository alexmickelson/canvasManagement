using CanvasModel.EnrollmentTerms;

namespace Management.Test;

public class SemesterPlannerTests
{
  [Test]
  public void TestCanCreatePlanner()
  {
    var canvasTerm = new EnrollmentTermModel(
      Id: 1,
      Name: "one",
      StartAt: new DateTime(2022, 1, 1),
      EndAt: new DateTime(2022, 1, 2)
    );

    var semester = new SemesterPlanner(canvasTerm);

    semester.Months.Count().Should().Be(1);
  }
  
  [Test]
  public void TestNewPlannerHasCorrectNumberOfMonths()
  {
    var canvasTerm = new EnrollmentTermModel(
      Id: 1,
      Name: "one",
      StartAt: new DateTime(2022, 1, 1),
      EndAt: new DateTime(2022, 2, 1)
    );

    var semester = new SemesterPlanner(canvasTerm);

    semester.Months.Count().Should().Be(2);
  }
}