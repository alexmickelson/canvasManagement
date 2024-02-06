using System.Diagnostics;

public static class DiagnosticsConfig
{
  public const string SourceName = "canvas-management-source";
  public static ActivitySource Source = new ActivitySource(SourceName);
}
