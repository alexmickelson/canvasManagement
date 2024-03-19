using System.Diagnostics;

namespace Management.Actors;

public sealed record GetModulesMessage(
  long RequestId,
  ulong CanvasCourseId,
  string ClientConnectionId,
  ActivityTraceId? ParentTrace,
  ActivitySpanId? ParentSpan
) : ITraceableMessage;
