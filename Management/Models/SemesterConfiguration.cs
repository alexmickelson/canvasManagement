public record SemesterConfiguration(
  DateTime StartDate,
  DateTime EndDate,
  IEnumerable<DayOfWeek> Days
);