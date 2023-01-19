using CanvasModel.EnrollmentTerms;

public class ConfigurationManagement : IConfigurationManagement
{
  public void SetConfiguration(
    EnrollmentTermModel canvasTerm,
    DayOfWeek[] daysOfWeek
  )
  {
    var start = canvasTerm.StartAt ?? throw new Exception($"Canvas Term must have a start date. Term: {canvasTerm.Name}");
    var end = canvasTerm.EndAt ?? throw new Exception($"Canvas Term must have a end date. Term: {canvasTerm.Name}");

    Configuration = new SemesterConfiguration(
      StartDate: start,
      EndDate: end,
      Days: daysOfWeek
    );
  }

  public SemesterConfiguration? Configuration { get; private set; } = null;



}