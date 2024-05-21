
using Akka.Actor;
using Akka.DependencyInjection;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Management.Services;


public class AkkaService(
  IServiceProvider serviceProvider,
  IHostApplicationLifetime appLifetime,
  IConfiguration configuration
) : IHostedService
{
  private ActorSystem? actorSystem;
  private readonly IConfiguration configuration = configuration;
  private readonly IServiceProvider serviceProvider = serviceProvider;
  private readonly IHostApplicationLifetime applicationLifetime = appLifetime;
  public IActorRef? CoursePlannerActor { get; private set; }
  public IActorRef? StorageActor { get; private set; }

  public Task StartAsync(CancellationToken cancellationToken)
  {
    var bootstrap = BootstrapSetup.Create();
    var dependencyInjectionSetup = DependencyResolverSetup.Create(serviceProvider);

    var mergedSystemSetup = bootstrap.And(dependencyInjectionSetup);

    actorSystem = ActorSystem.Create("canavas-management-actor-system", mergedSystemSetup);

    var canvasQueueProps = DependencyResolver.For(actorSystem).Props<CoursePlannerActor>();
    CoursePlannerActor = actorSystem.ActorOf(canvasQueueProps, "canvasQueue");
    var localStorageProps = DependencyResolver.For(actorSystem).Props<LocalStorageActor>();
    StorageActor = actorSystem.ActorOf(localStorageProps, "localStorage");

    // crash if the actor system crashes, awaiting never returns...
    actorSystem.WhenTerminated.ContinueWith(tr =>
    {
      applicationLifetime.StopApplication();
    });

    return Task.CompletedTask;
  }

  public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;


  // public void Tell(object message)
  // {
  //   userSessionSupervisor?.Tell(message);
  // }

  // public Task<T> Ask<T>(object message)
  // {
  //   return userSessionSupervisor.Ask<T>(message);
  // }

}
