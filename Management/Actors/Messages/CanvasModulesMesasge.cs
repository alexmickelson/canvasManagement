using System.Diagnostics;
using CanvasModel.Modules;

namespace Management.Actors;

public sealed record CanvasModulesMessage(
  long RequestId,
  ulong CanvasCourseId,
  IEnumerable<CanvasModule> CanvasModules,
  ActivityTraceId? ParentTrace,
  ActivitySpanId? ParentSpan
) : ITraceableMessage;
