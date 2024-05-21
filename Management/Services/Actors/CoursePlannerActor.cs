using Akka.Actor;

using Management.Services;

using Microsoft.Extensions.DependencyInjection;

public class CoursePlannerActor: ReceiveActor
{
  private readonly IServiceProvider serviceProvider;
  private readonly IServiceScope scope;
  private readonly MyLogger<CoursePlannerActor> logger;
  public CoursePlannerActor(IServiceProvider serviceProviderArg)
  {
    serviceProvider = serviceProviderArg;
    scope = serviceProvider.CreateScope();
    logger = scope.ServiceProvider.GetRequiredService<MyLogger<CoursePlannerActor>>();
  }
}