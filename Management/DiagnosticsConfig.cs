using System.Diagnostics;
using System.Security.Policy;

public static class DiagnosticsConfig
{
  public const string SourceName = "canvas-management-source";
  public readonly static ActivitySource Source = new(SourceName);

  public static Activity? Activity(this ITraceableMessage message, string activityName)
  {
    if (message.ParentTrace != null && message.ParentSpan != null)
    {
      ActivityContext parentContext = new ActivityContext(
        (ActivityTraceId)message.ParentTrace,
        (ActivitySpanId)message.ParentSpan,
        ActivityTraceFlags.Recorded
      );

      return Source?.StartActivity(activityName, ActivityKind.Internal, parentContext);
    }
    return Source?.StartActivity(activityName);
  }
}
