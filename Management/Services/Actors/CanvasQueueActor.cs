using Akka.Actor;

using Microsoft.Extensions.DependencyInjection;

public class CanvasQueueActor : ReceiveActor
{
  private readonly IServiceProvider serviceProvider;
  private readonly IServiceScope scope;
  private readonly ILogger<CanvasQueueActor> logger;

  public CanvasQueueActor(IServiceProvider serviceProviderArg)
  {
    serviceProvider = serviceProviderArg;
    scope = serviceProvider.CreateScope();
    logger  = scope.ServiceProvider.GetRequiredService<ILogger<CanvasQueueActor>>();
    
  }
}