using System.Diagnostics;
using System.Security.Policy;

public static class DiagnosticsConfig
{
  public const string SourceName = "canvas-management-source";
  public readonly static ActivitySource Source = new(SourceName);
}
