using System.Diagnostics;
using OpenTelemetry;

public class CustomConsoleExporter : BaseExporter<Activity>
{
  public override ExportResult Export(in Batch<Activity> batch)
  {
    using var scope = SuppressInstrumentationScope.Begin();

    foreach (var activity in batch)
    {
      string[] ignoreOperations = [
        "Microsoft.AspNetCore.Hosting.HttpRequestIn",
      ];
      if (!ignoreOperations.Contains(activity.OperationName))
        Console.WriteLine($"{activity.OperationName}: {activity.DisplayName}");
    }
    return ExportResult.Success;
  }
}