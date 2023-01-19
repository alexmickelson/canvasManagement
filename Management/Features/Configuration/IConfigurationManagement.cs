using CanvasModel.EnrollmentTerms;

public interface IConfigurationManagement
{
  SemesterConfiguration? Configuration { get; }

  void SetConfiguration(EnrollmentTermModel canvasTerm, DayOfWeek[] daysOfWeek);
}
