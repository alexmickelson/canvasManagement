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

    // baseLogger.Log(logLevel, finalMessage);
    Console.WriteLine(finalMessage);
  }
}