using System.Diagnostics;

public interface ITraceableMessage
{
  public ActivitySpanId? ParentSpan { get; }
  public ActivityTraceId? ParentTrace { get; }
}

