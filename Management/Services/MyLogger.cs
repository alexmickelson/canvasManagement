using System.Runtime.CompilerServices;

namespace Management.Services;


public class MyLogger<T>
{
  private readonly ILogger<T> baseLogger;

  public MyLogger(ILogger<T> baseLogger)
  {
    this.baseLogger = baseLogger;
  }

  public void Log(
    string message,
    LogLevel logLevel = LogLevel.Information,
    [CallerMemberName] string memberName = ""
  )
  {
    var finalMessage = $"[{typeof(T)}.{memberName}] {message}";

    baseLogger.Log(logLevel, finalMessage);
    Console.WriteLine(finalMessage);
  }

  public void Trace(
    string message,
    LogLevel logLevel = LogLevel.Trace,
    [CallerMemberName] string memberName = ""
  )
  {
    var finalMessage = $"[{typeof(T)}.{memberName}] {message}";

    baseLogger.Log(logLevel, finalMessage);
    Console.WriteLine(finalMessage);
  }
  public void Error(
    string message,
    LogLevel logLevel = LogLevel.Error,
    [CallerMemberName] string memberName = ""
  )
  {
    var finalMessage = $"ERROR: [{typeof(T)}.{memberName}] {message}";

    baseLogger.Log(logLevel, finalMessage);
    Console.WriteLine(finalMessage);
  }
}