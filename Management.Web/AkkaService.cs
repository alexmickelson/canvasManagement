
using Akka.Actor;
using Akka.DependencyInjection;
namespace Management.Actors;


public class AkkaService : IHostedService, IActorBridge
{
  private ActorSystem? _actorSystem;
  private readonly IConfiguration _configuration;
  private readonly IServiceProvider _serviceProvider;
  private IActorRef? _canvasApiActor;
  private readonly IHostApplicationLifetime _applicationLifetime;

  public AkkaService(IServiceProvider serviceProvider, IHostApplicationLifetime appLifetime, IConfiguration configuration)
  {
    _serviceProvider = serviceProvider;
    _applicationLifetime = appLifetime;
    _configuration = configuration;
  }

  public Task StartAsync(CancellationToken cancellationToken)
  {
    var bootstrap = BootstrapSetup.Create();
    var dependencyInjectionSetup = DependencyResolverSetup.Create(_serviceProvider);

    var mergedSystemSetup = bootstrap.And(dependencyInjectionSetup);

    _actorSystem = ActorSystem.Create("canvas-managment-actors", mergedSystemSetup);

    // start top level supervisor actor

    // working here https://getakka.net/articles/actors/dependency-injection.html#integrating-with-microsoftextensionsdependencyinjection
    var apiActorProps = DependencyResolver.For(_actorSystem).Props<CanvasApiActor>();
    _canvasApiActor = _actorSystem.ActorOf(apiActorProps, "canvas-api");

    // crash if the actor system crashes, awaiting never returns...
#pragma warning disable CA2016 // Forward the 'CancellationToken' parameter to methods
    _actorSystem.WhenTerminated.ContinueWith(tr =>
    {
      _applicationLifetime.StopApplication();
    });
#pragma warning restore CA2016 // Forward the 'CancellationToken' parameter to methods

    return Task.CompletedTask;
  }

  public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;


  // add more methods to interact with actor processes, make them part of an interface
  // these are the most generic forwarding of messages
  public void Tell(object message)
  {
    _canvasApiActor.Tell(message);
  }

  public Task<T> Ask<T>(object message)
  {
    return _canvasApiActor.Ask<T>(message);
  }
}
